import React, { useContext, useEffect, forwardRef } from 'react';
import { ToggleButton, ToggleButtonProps } from '@material-ui/lab';
import { setBlockData, setBlocksData } from '../../utils';
import EditorContext from '../EditorContext';

export interface TextAlignToggleButtonProps
    extends Omit<ToggleButtonProps, 'value'> {
    value: 'left' | 'center' | 'right' | 'justify';
    ignoreSelection?: boolean;
}

const TextAlignToggleButton = forwardRef<
    HTMLButtonElement,
    TextAlignToggleButtonProps
>(
    (
        {
            selected,
            value,
            children,
            ignoreSelection = false,
            ...rest
        }: TextAlignToggleButtonProps,
        ref
    ) => {
        const { editorState, setEditorState } = useContext(EditorContext) || {};

        useEffect(() => {
            if (selected) {
                handleClick();
            }
        }, []);

        const handleClick = () => {
            if (editorState && setEditorState) {
                const contentState = editorState.getCurrentContent();
                const selectionState = editorState.getSelection();
                const blockData = { textAlign: value };

                if (ignoreSelection) {
                    const contentBlocks = contentState.getBlocksAsArray();

                    if (!!contentBlocks.length) {
                        setEditorState(
                            setBlocksData(
                                editorState,
                                contentState,
                                contentBlocks[0].getKey(),
                                contentBlocks[
                                    contentBlocks.length - 1
                                ].getKey(),
                                blockData
                            )
                        );
                    }
                } else {
                    setEditorState(
                        setBlockData(
                            editorState,
                            contentState,
                            selectionState,
                            blockData
                        )
                    );
                }
            }
        };

        return (
            <ToggleButton
                ref={ref}
                selected={selected}
                onClick={handleClick}
                value={value}
                {...rest}
            >
                {children}
            </ToggleButton>
        );
    }
);

export default TextAlignToggleButton;