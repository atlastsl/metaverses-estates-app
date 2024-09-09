import {CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, useColorModes} from "@coreui/react";
import {cilContrast, cilMoon, cilSun} from "@coreui/icons";
import {CIcon} from "@coreui/icons-react";


export default function ThemeSelector() {

    const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

    return (
        <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
                {colorMode === 'dark' ? (
                    <CIcon icon={cilMoon} size="lg" />
                ) : colorMode === 'auto' ? (
                    <CIcon icon={cilContrast} size="lg" />
                ) : (
                    <CIcon icon={cilSun} size="lg" />
                )}
            </CDropdownToggle>
            <CDropdownMenu>
                <CDropdownItem
                    active={colorMode === 'light'}
                    className="d-flex align-items-center"
                    as="button"
                    type="button"
                    onClick={() => setColorMode('light')}
                >
                    <CIcon className="me-2" icon={cilSun} size="lg" /> Light
                </CDropdownItem>
                <CDropdownItem
                    active={colorMode === 'dark'}
                    className="d-flex align-items-center"
                    as="button"
                    type="button"
                    onClick={() => setColorMode('dark')}
                >
                    <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
                </CDropdownItem>
                <CDropdownItem
                    active={colorMode === 'auto'}
                    className="d-flex align-items-center"
                    as="button"
                    type="button"
                    onClick={() => setColorMode('auto')}
                >
                    <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
                </CDropdownItem>
            </CDropdownMenu>
        </CDropdown>
    )
}