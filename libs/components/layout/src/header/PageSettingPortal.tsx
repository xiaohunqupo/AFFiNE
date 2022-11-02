import { services } from '@toeverything/datasource/db-service';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MoreIcon } from '@toeverything/components/icons';
import {
    ListButton,
    MuiDivider as Divider,
    MuiSnackbar as Snackbar,
    MuiSwitch as Switch,
    Popover,
    styled,
} from '@toeverything/components/ui';
import { useFlag } from '@toeverything/datasource/feature-flags';
import { useUserAndSpaces } from '@toeverything/datasource/state';
import { copyToClipboard } from '@toeverything/utils';
import format from 'date-fns/format';
import { FileExporter } from './file-exporter/file-exporter';
import { PageBlock } from './types';
const PageSettingPortalContainer = styled('div')({
    width: '320p',
    padding: '15px',
    '.textDescription': {
        height: '22px',
        lineHeight: '22px',
        marginLeft: '30px',
        fontSize: '14px',
        color: '#ccc',
        p: {
            margin: 0,
        },
    },
    '.switchDescription': {
        color: '#ccc',
        fontSize: '14px',
        paddingLeft: '30px',
    },
});

const BtnPageSettingContainer = styled('div')({
    width: '24px',
    height: '24px',
});

const MESSAGES = {
    COPY_LINK: ' Copy Link',
    INVITE: 'Add people,emails, or groups',
    COPY_LINK_SUCCESS: 'Copyed link to clipboard',
};

function PageSettingPortal() {
    const [alertOpen, setAlertOpen] = useState(false);
    const { workspaceId } = useParams();
    const [pageBlock, setPageBlock] = useState<PageBlock>();

    const params = useParams();
    const pageId = params['*'].split('/')[0];
    const navigate = useNavigate();
    const { user } = useUserAndSpaces();
    const BooleanFullWidthChecked = useFlag('BooleanFullWidthChecked', false);
    const BooleanExportHtml = useFlag('BooleanExportHtml', false);
    const BooleanExportPdf = useFlag('BooleanExportPdf', false);
    const BooleanExportMarkdown = useFlag('BooleanExportMarkdown', false);

    const fetchPageBlock = useCallback(async () => {
        const dbPageBlock = await services.api.editorBlock.getBlock(
            workspaceId,
            pageId
        );
        if (!dbPageBlock) return;
        const text = dbPageBlock.getDecoration('text');
        setPageBlock({
            lastUpdated: dbPageBlock.lastUpdated,
            fullWidthChecked:
                dbPageBlock.getDecoration('fullWidthChecked') || false,
            title:
                text &&
                //@ts-ignore
                text.value[0].text,
        });
    }, [workspaceId, pageId]);

    useEffect(() => {
        fetchPageBlock();
    }, [workspaceId, pageId, fetchPageBlock]);
    const redirectToPage = (newWorkspaceId: string, newPageId: string) => {
        navigate('/' + newWorkspaceId + '/' + newPageId);
    };

    const handleDuplicatePage = async () => {
        //create page
        const newPage = await services.api.editorBlock.create({
            workspace: workspaceId,
            type: 'page' as const,
        });
        //add page to tree
        await services.api.pageTree.addNextPageToWorkspace(
            workspaceId,
            pageId,
            newPage.id
        );
        //copy source page to new page
        await services.api.editorBlock.copyPage(
            workspaceId,
            pageId,
            newPage.id
        );

        redirectToPage(workspaceId, newPage.id);
    };

    const handleCopy = () => {
        copyToClipboard(window.location.href);
        setAlertOpen(true);
    };
    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const handleExportWorkspace = () => {
        //@ts-ignore
        window.client.inspector().save();
    };

    const handleImportWorkspace = () => {
        //@ts-ignore
        window.client
            .inspector()
            .load()
            .then(() => {
                window.location.href = `/${workspaceId}/`;
            });
    };

    const handleFullWidthCheckedChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const checked = event.target.checked;
        setPageBlock({
            lastUpdated: pageBlock.lastUpdated,
            fullWidthChecked: checked,
        });
        services.api.editorBlock.update({
            properties: {
                fullWidthChecked: checked,
            },
            id: pageId,
            workspace: workspaceId,
        });
    };

    const handleExportHtml = async () => {
        //@ts-ignore
        const htmlContent = await virgo.clipboard.clipboardUtils.page2html();
        const htmlTitle = pageBlock.title;

        FileExporter.exportHtml(htmlTitle, htmlContent);
    };

    const handleExportMarkdown = async () => {
        //@ts-ignore
        const htmlContent = await virgo.clipboard.clipboardUtils.page2html();
        const htmlTitle = pageBlock.title;
        FileExporter.exportMarkdown(htmlTitle, htmlContent);
    };
    return (
        <BtnPageSettingContainer>
            <Popover
                trigger="click"
                placement="bottom-end"
                content={
                    <PageSettingPortalContainer>
                        {BooleanFullWidthChecked && (
                            <>
                                <div className="switchDescription">
                                    Full width
                                    <Switch
                                        checked={
                                            pageBlock &&
                                            pageBlock.fullWidthChecked
                                        }
                                        onChange={handleFullWidthCheckedChange}
                                        disabled={true}
                                    />
                                </div>
                                <Divider />
                            </>
                        )}

                        <ListButton
                            content="Duplicate Page"
                            onClick={handleDuplicatePage}
                        />
                        <ListButton
                            content={MESSAGES.COPY_LINK}
                            onClick={handleCopy}
                        />
                        <Divider />
                        {BooleanExportMarkdown && (
                            <ListButton
                                content="Export As Markdown"
                                onClick={handleExportMarkdown}
                            />
                        )}
                        {BooleanExportHtml && (
                            <ListButton
                                content="Export As HTML"
                                onClick={handleExportHtml}
                            />
                        )}
                        {BooleanExportPdf && (
                            <ListButton
                                content="Export As PDF"
                                onClick={handleCopy}
                            />
                        )}
                        <Divider />
                        <ListButton
                            content="Import Workspace"
                            onClick={handleImportWorkspace}
                        />
                        <ListButton
                            content="Export Workspace"
                            onClick={handleExportWorkspace}
                        />

                        <p className="textDescription">
                            Last edited by {user && user.nickname}
                            <br />
                            {pageBlock &&
                                `${format(
                                    new Date(pageBlock.lastUpdated),
                                    'MM/dd/yyyy hh:mm'
                                )}`}
                        </p>

                        <Snackbar
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            open={alertOpen}
                            message={MESSAGES.COPY_LINK_SUCCESS}
                            key={'bottomcenter'}
                            autoHideDuration={2000}
                            onClose={handleAlertClose}
                        />
                    </PageSettingPortalContainer>
                }
            >
                <MoreIcon />
            </Popover>
        </BtnPageSettingContainer>
    );
}

export { PageSettingPortal };
