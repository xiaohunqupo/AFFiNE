import { useNavigate, useParams } from 'react-router-dom';
import { Descendant } from 'slate';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { styled } from '@toeverything/components/ui';
import { BlockSearchItem } from '@toeverything/datasource/jwt';

import { BlockPreview } from '../../block-preview';

export type RefLinkElement = {
    type: 'reflink';
    reference: string;
    children: Descendant[];
};

const BlockPreviewContainer = styled(BlockPreview)({
    width: '100%',
    margin: '0px!important',
    paddingLeft: '0px!important',
    paddingRight: '0px!important',
});

type InlineRefLinkProps = {
    block?: BlockSearchItem;
    pageId: string;
};

export const InlineRefLink = ({ block, pageId }: InlineRefLinkProps) => {
    const { workspaceId } = useParams();
    const navigate = useNavigate();

    if (block) {
        return (
            <BlockPreviewContainer
                block={block}
                onClick={() => navigate(`/${workspaceId}/${pageId}`)}
            />
        );
    }
    return <span>Loading...</span>;
};
