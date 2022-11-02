import { styled } from '@toeverything/components/ui';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { StatusText } from './StatusText';
import { StatusTrack } from './StatusTrack';
import { DocMode } from './type';

const isBoard = (pathname: string): boolean => pathname.endsWith('/edgeless');

export const Switcher = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { pathname } = useLocation();
    const pageViewMode = isBoard(pathname) ? DocMode.board : DocMode.doc;

    const switchToPageView = (targetViewMode: DocMode) => {
        if (targetViewMode === pageViewMode) {
            return;
        }
        const workspaceId = params['workspaceId'];
        /**
         * There are two possible modes:
         * Page mode: /{workspaceId}/{pageId}
         * Board mode: /{workspaceId}/{pageId}/edgeless
         */
        const pageId = params['*'].split('/')[0];
        const targetUrl = `/${workspaceId}/${pageId}${
            targetViewMode === DocMode.board ? '/edgeless' : ''
        }`;
        navigate(targetUrl);
    };

    return (
        <StyledContainerForSwitcher>
            <StatusText
                width={'44px'}
                active={pageViewMode === DocMode.doc}
                onClick={() => switchToPageView(DocMode.doc)}
            >
                Paper
            </StatusText>
            <StatusTrack
                mode={pageViewMode}
                onClick={() => {
                    switchToPageView(
                        pageViewMode === DocMode.board
                            ? DocMode.doc
                            : DocMode.board
                    );
                }}
            />
            <StatusText
                width={'56px'}
                active={pageViewMode === DocMode.board}
                onClick={() => switchToPageView(DocMode.board)}
            >
                Edgeless
            </StatusText>
        </StyledContainerForSwitcher>
    );
};

const StyledContainerForSwitcher = styled('div')({
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'all',
});
