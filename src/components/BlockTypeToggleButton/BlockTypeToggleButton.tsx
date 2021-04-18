import React, { forwardRef, useCallback, useContext } from 'react';
import { EditorState, RichUtils } from 'draft-js';
import DraftToggleButton from '../DraftToggleButton/DraftToggleButton';
import { ToggleButtonProps } from '@material-ui/lab';
import EditorContext from '../EditorContext';

export interface BlockTypeToggleButtonProps
  extends Omit<ToggleButtonProps, 'value'> {
  /**
   * If `true`, inline style will not be available from keyboard shortcuts
   * @default false
   */
  disableKeyboardShortcuts?: boolean;
  /**
   *
   */
  value: string;
  runFirstTime?: boolean;
}

const BlockTypeToggleButton = forwardRef<
  HTMLButtonElement,
  BlockTypeToggleButtonProps
>(({ value, selected, children, ...rest }: BlockTypeToggleButtonProps, ref) => {
  const { editorState, setEditorState } = useContext(EditorContext) || {};

  const handleToggle = useCallback(
    (newEditorState: EditorState): void => {
      setEditorState?.(RichUtils.toggleBlockType(newEditorState, value));
    },
    [value]
  );

  return (
    <DraftToggleButton
      ref={ref}
      value={value}
      onToggle={handleToggle}
      selected={
        editorState && value === RichUtils.getCurrentBlockType(editorState)
      }
      keyCommand={value}
      {...rest}
    >
      {children}
    </DraftToggleButton>
  );
});

export default BlockTypeToggleButton;
