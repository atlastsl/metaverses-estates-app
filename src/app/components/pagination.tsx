// @ts-nocheck
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {CButton} from "@coreui/react";
import {CIcon} from "@coreui/icons-react";
import {cilCaretLeft, cilCaretRight} from "@coreui/icons";
import {_str_of} from "../../helpers/intl/texts.tokens.ts";

export interface TPaginationProps {
    options: 'GET' | 'POST';
    total?: number;
    page?: number;
    take?: number;
    get?: (page: number, take: number, e?: Event) => Promise<void>,
    search?: (page: number, take: number, payload: any, e?: Event) => Promise<void>,
    searchPayload?: any,
    refreshHandler?: string
}

export const DEFAULT_PAGE: number = 1;
export const DEFAULT_TAKE: number = 10;
export const TAKES_OPTIONS = [15, 30, 50, 80, 100]

export function Pagination(props: TPaginationProps) {
    const {t} = useTranslation();

    const [start,setStart] = useState(DEFAULT_PAGE);
    const [end, setEnd] = useState(props.take || DEFAULT_TAKE);

    function getStartAndEnd(page: number, take: number): void {
        setStart(take*(page-1)+1);
        setEnd(take*page);
    }

    function init(total: number): number {
        const take = props.take || DEFAULT_TAKE;
        let endPage = 1;
        if (total <= take) {
            endPage = 1;
        } else {
            endPage = Math.trunc(total/take);
            let m = total % take;
            if (m !== 0) {
                endPage = endPage +1;
            }
        }
        return endPage;
    }

    function go(e: Event): void {
        const endPage = init(props.total || 0);
        const take = props.take || DEFAULT_TAKE;
        let page = props.page || DEFAULT_PAGE;
        if(page < endPage){
            page = page + 1;
        }else{
            page = 1;
        }
        getStartAndEnd(page, take);
        if(props.options === "POST"){
            if (props.search) {
                props.search(page, take, props.searchPayload, e).then();
            }
        } else {
            if (props.get) {
                props.get(page, take, e).then();
            }
        }
    }

    function back(e?: Event){
        const endPage = init(props.total || 0);
        const take = props.take || DEFAULT_TAKE;
        let page = props.page || DEFAULT_PAGE;
        if (page > 1) {
            page = page - 1;
        } else {
            page = endPage;
        }
        getStartAndEnd(page, take);
        if(props.options === "POST"){
            if (props.search) {
                props.search(page, take, props.searchPayload, e).then();
            }
        } else {
            if (props.get) {
                props.get(page, take, e).then();
            }
        }
    }

    useEffect(
        () => {
            getStartAndEnd(1, props.take || DEFAULT_TAKE);
        },
        [props.refreshHandler]
    );

    return(
        <div className={(props.total || 0) === 0 ? "invisible" : ""}>
            <div className="d-flex justify-content-end align-items-center">
                <span className="ms-2">
                  {start} - {end > (props.total || 0) ? (props.total || 0) : end} {t(_str_of)} {(props.total || 0)}
                </span>
                <CButton color="dark" variant="ghost" className="ms-3" size="sm" onClick={(e) => back(e)} disabled={(props.total || 0) <= (props.take || DEFAULT_TAKE)}>
                    <CIcon icon={cilCaretLeft} />
                </CButton>
                <CButton color="dark" variant="ghost" className="ms-2 me-3" size="sm" onClick={(e) => go(e)} disabled={(props.total || 0) <= (props.take || DEFAULT_TAKE)}>
                    <CIcon icon={cilCaretRight} />
                </CButton>
            </div>
        </div>
    )

}

export default Pagination;