import {
    forwardRef,
    useState,
    type CSSProperties,
    type ForwardedRef,
    type ReactNode,
    type RefAttributes,
    useEffect,
} from 'react';
/* eslint-disable no-restricted-imports */
import SelectUnstyled, {
    selectUnstyledClasses,
    type SelectUnstyledProps,
} from '@mui/base/SelectUnstyled';
/* eslint-disable no-restricted-imports */
import PopperUnstyled from '@mui/base/PopperUnstyled';
import { ArrowDropDownIcon } from '@toeverything/components/icons';
import { styled } from '../styled';
type ExtendSelectProps = {
    // Width is always used custom, it will be set to root button and popover
    width?: number | string;
    style?: CSSProperties;
    listboxStyle?: CSSProperties;
    placeholder?: ReactNode;
    open?: boolean;
};

/**
 *  Select is extend by mui SelectUnstyled
 *
 *  SelectUnstyled Demos:
 *
 * - [SelectUnstyled](https://mui.com/zh/base/react-select/)
 *
 * SelectUnstyled API:
 *
 * - [SelectUnstyled API](https://mui.com/zh/base/api/select-unstyled/)
 *
 * **/
export const Select = forwardRef(function CustomSelect<TValue>(
    props: ExtendSelectProps & SelectUnstyledProps<TValue>,
    ref: ForwardedRef<HTMLUListElement>
) {
    const {
        width = '100%',
        style,
        listboxStyle,
        placeholder,
        onListboxOpenChange,
        onChange,
        open: propsOpen,
    } = props;
    const openControlledByProps = propsOpen !== undefined;
    const [isOpen, setIsOpen] = useState(false);

    const components: SelectUnstyledProps<TValue>['components'] = {
        // Root: generateStyledRoot({ width, ...style }),
        Root: forwardRef((rootProps, rootRef) => {
            const {
                ownerState: { open },
            } = rootProps;

            return (
                <StyledRoot
                    ref={rootRef}
                    {...rootProps}
                    style={{
                        width,
                        ...style,
                    }}
                >
                    {rootProps.children || (
                        <StyledPlaceholder>{placeholder}</StyledPlaceholder>
                    )}
                    <StyledSelectedArrowWrapper open={open}>
                        <ArrowDropDownIcon />
                    </StyledSelectedArrowWrapper>
                </StyledRoot>
            );
        }),
        Listbox: forwardRef((listboxProps, listboxRef) => (
            <StyledListbox
                ref={listboxRef}
                {...listboxProps}
                style={{ width, ...listboxStyle }}
            />
        )),
        Popper: StyledPopper,
        ...props.components,
    };

    return (
        <SelectUnstyled
            {...props}
            listboxOpen={openControlledByProps ? propsOpen : isOpen}
            onListboxOpenChange={open => {
                !openControlledByProps && setIsOpen(open);
                onListboxOpenChange?.(open);
            }}
            onChange={v => {
                !openControlledByProps && setIsOpen(false);
                onChange?.(v);
            }}
            ref={ref}
            components={components}
        />
    );
}) as <TValue>(
    props: ExtendSelectProps &
        SelectUnstyledProps<TValue> &
        RefAttributes<HTMLUListElement>
) => JSX.Element;

const StyledSelectedArrowWrapper = styled('div')<{ open: boolean }>(
    ({ open }) => ({
        position: 'absolute',
        top: '0',
        bottom: '0',
        right: '12px',
        margin: 'auto',
        lineHeight: '32px',
        display: 'flex',
        alignItems: 'center',
        transform: `rotate(${open ? '180deg' : '0'})`,
    })
);

const StyledRoot = styled('div')(({ theme }) => ({
    height: '32px',
    border: `1px solid ${theme.affine.palette.borderColor}`,
    borderRadius: '10px',
    color: theme.affine.palette.secondaryText,
    padding: '0 12px',
    fontSize: '14px',
    transition: 'border .1s',
    textAlign: 'left',
    paddingLeft: '12px',
    paddingRight: ' 30px',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',

    '&:hover': {},

    [`&.${selectUnstyledClasses.focusVisible}`]: {},

    [`&.${selectUnstyledClasses.expanded}`]: {
        borderColor: `${theme.affine.palette.primary}`,
    },
}));

const StyledListbox = styled('ul')(({ theme }) => ({
    fontSize: '14px',
    padding: '8px 4px',
    color: theme.affine.palette.secondaryText,
    background: '#fff',
    borderRadius: '10px',
    overflow: 'auto',
    boxShadow: theme.affine.shadows.shadow1,
}));

const StyledPopper = styled(PopperUnstyled)`
    z-index: 1;
`;

const StyledPlaceholder = styled('div')(({ theme }) => ({
    color: `${theme.affine.palette.borderColor}`,
}));
