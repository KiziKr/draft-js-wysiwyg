import React from 'react';
import { render } from '../utils/parseMarkdown';
import MarkdownElement from './MarkdownElement';
import Demo from './Demo';
import { Container, makeStyles } from '@material-ui/core';

interface MarkdownDocsProps {
    markdown: string;
}

const useStyles = makeStyles({
    main: {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 96,
    },
});

const MarkdownDocs = ({ markdown }: MarkdownDocsProps): JSX.Element => {
    const classes = useStyles();

    const getDemoData = (demoPath: string) => {
        return {
            raw: require(`!raw-loader!../../examples/${demoPath}`).default,
            component: require(`../../examples/${demoPath}`).default,
            language: demoPath.match(/(tsx|jsx|js)/g)?.[0] || 'js',
        };
    };

    return (
        <Container component="main" maxWidth="md" className={classes.main}>
            {render(markdown).map(({ isDemo, content }, key) => {
                if (isDemo) {
                    return <Demo {...getDemoData(content)} key={key} />;
                }

                return (
                    <MarkdownElement
                        key={key}
                        className=""
                        htmlOrRaw={content}
                    />
                );
            })}
        </Container>
    );
};

export default MarkdownDocs;