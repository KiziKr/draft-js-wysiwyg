import React, { useContext } from 'react';
import { Editor, RichUtils, getDefaultKeyBinding } from 'draft-js';
import EditorContext from './EditorContext';
import { mergeBlockData, indentSelection, outdentSelection } from './utils';

export const EditorDraft = ({
    acceptCommands,
    ...rest
}) => {
    const { editorState, setEditorState } = useContext(EditorContext);
    const editor = React.useRef(null);

    const focusEditor = (e) => {
        setTimeout(() => {
            editor.current.focus();
        }, 0);
    }

    React.useEffect(() => {
        focusEditor()
    }, []);

    const handleKeyCommand = (command, editorState) => {
        if (!acceptCommands || acceptCommands.includes(command)) {
            const newState = RichUtils.handleKeyCommand(editorState, command);

            if (newState) {
                setEditorState(newState);
                return 'handled';
            }
        }

        return 'not-handled';
    }

    const handleReturn = () => {
        const contentState = editorState.getCurrentContent();
        const startKey = editorState.getSelection().getStartKey();

        if (contentState) {
            setEditorState(mergeBlockData(editorState, contentState, startKey));
            return "handled";
        }

        return "not-handled"
    }

    const keyBindingFn = (event) => {
        const contentState = editorState.getCurrentContent();

        if (event.shiftKey) {
            switch (event.key) {
                case 'Tab':
                    event.preventDefault();
                    setEditorState(outdentSelection(editorState, contentState));
                    return null;
            }
        } else {
            switch (event.key) {
                case 'Tab':
                    event.preventDefault();
                    setEditorState(indentSelection(editorState, contentState));
                    return null;
            }
        }

        return getDefaultKeyBinding(event);
    }

    return (
        <div onClick={focusEditor}>
            <Editor
                ref={editor}
                editorState={editorState}
                onChange={setEditorState}
                handleKeyCommand={handleKeyCommand}
                handleReturn={handleReturn}
                blockStyleFn={(block) => {
                    const textAlign = block.getData()?.get('textAlign');

                    if (textAlign) {
                        return `align-${textAlign}`;
                    }
                }}
                keyBindingFn={keyBindingFn}
                {...rest}
            />
        </div>
    );
}
