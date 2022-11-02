import { styled, Typography } from '@toeverything/components/ui';
import { useTranslation } from '@toeverything/datasource/i18n';
import { useUserAndSpaces } from '@toeverything/datasource/state';
import format from 'date-fns/format';
import { usePageLastUpdated, useWorkspaceAndPageId } from '../util';

export const LastModified = () => {
    const { user } = useUserAndSpaces();
    const username = user ? user.nickname : 'Anonymous';
    const { workspaceId, pageId } = useWorkspaceAndPageId();
    const lastModified = usePageLastUpdated({ workspaceId, pageId });
    const formatLastModified = format(lastModified, 'MM/dd/yyyy hh:mm');
    const { t } = useTranslation();
    return (
        <div>
            <div>
                <ContentText type="xs">
                    <span>{t('Last edited by', { name: username })}</span>
                </ContentText>
            </div>
            <div>
                <ContentText type="xs">{formatLastModified}</ContentText>
            </div>
        </div>
    );
};

const ContentText = styled(Typography)(({ theme }) => {
    return {
        color: theme.affine.palette.icons,
    };
});
