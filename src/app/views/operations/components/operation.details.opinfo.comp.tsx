// @ts-nocheck
import {Operation} from "../../../../data/operations/operations.dto.ts";
import React from "react";
import {useTranslation} from "react-i18next";
import {CBadge, CListGroup, CListGroupItem} from "@coreui/react";
import {
    _str_operation_amount,
    _str_operation_date,
    _str_operation_details_title,
    _str_operation_fees,
    _str_operation_receiver,
    _str_operation_sender,
    _str_operation_type,
    _str_transaction_hash,
    _str_transaction_type_label
} from "../../../../helpers/intl/texts.tokens.ts";
import {getStakeholderBlockchainUrl} from "../../../../data/stakeholders/stakeholders.functions.tsx";
import {
    getOperationBlockchainUrl,
    getOperationTotalAmount,
    getOperationTotalFees,
    roundAmount
} from "../../../../data/operations/operations.functions.tsx";
import {DatesHelper} from "../../../../helpers/dates.helper.ts";
import {CIcon} from "@coreui/icons-react";
import {cilInfo} from "@coreui/icons";

export function OperationDetailsOpInfoComponent ({operation}: {operation: Operation | null}): React.ReactNode {
    const { t } = useTranslation();

    function handleOpenStakeholderBlockchainUrl(address?: string) {
        if (address && operation != null) {
            window.open(getStakeholderBlockchainUrl(address, operation.chain), '_blank');
        }
    }

    function handleOpenOperationBlockchainUrl() {
        if (operation != null) {
            window.open(getOperationBlockchainUrl(operation), '_blank');
        }
    }

    return (
        operation != null ? (
            <>
                <h6>{t(_str_operation_details_title)}</h6>

                <CListGroup>
                    <CListGroupItem>

                        <div className={"mb-2"}>
                            <small>{t(_str_operation_sender)}</small>
                            <div className={"d-flex align-items-center"}>
                                <a className={"fw-medium me-2"}
                                   href={getStakeholderBlockchainUrl(operation.sender, operation.chain)}
                                   target={'_blank'} rel={'noreferrer noopener'}>
                                    {operation.sender}
                                </a>
                                <CIcon icon={cilInfo} size={'sm'}
                                       onClick={() => handleOpenStakeholderBlockchainUrl(operation?.sender)}/>
                            </div>
                        </div>

                        <div className={"mb-2"}>
                            <small>{t(_str_operation_receiver)}</small>
                            <div className={"d-flex align-items-center"}>
                                <a className={"fw-medium me-2"}
                                   href={getStakeholderBlockchainUrl(operation.recipient, operation.chain)}
                                   target={'_blank'} rel={'noreferrer noopener'}>
                                    {operation.recipient}
                                </a>
                                <CIcon icon={cilInfo} size={'sm'}
                                       onClick={() => handleOpenStakeholderBlockchainUrl(operation?.recipient)}/>
                            </div>
                        </div>

                        <div className={"mb-2"}>
                            <small>{t(_str_operation_date)}</small>
                            <div className={"fw-medium"}>
                                {DatesHelper.getInstance().printDateAndTime(operation.mvt_date)}
                            </div>
                        </div>

                        <div className={"mb-2"}>
                            <small>{t(_str_operation_type)}</small>
                            <div
                                className={"fw-medium operation_type-" + operation.operation_type.toLowerCase()}>
                                {t(`operation_type_${operation.operation_type.toLowerCase()}`)}
                            </div>
                        </div>

                        <div className={"mb-2"}>
                            <small>{t(_str_transaction_type_label)}</small>
                            <div
                                className={"fw-medium transaction_type-" + operation.transaction_type.toLowerCase()}>
                                {t(`transaction_type_${operation.transaction_type.toLowerCase()}`)}
                            </div>
                        </div>

                        <div className={"mb-2"}>
                            <small>{t(_str_operation_amount)}</small>
                            <div className={"d-flex align-items-center"}>
                                <div className={"fw-medium me-2"}>{getOperationTotalAmount(operation, true)}</div>
                                {operation.amount.map((amount, index) => {
                                    return (
                                        <CBadge size={"sm"} color={"secondary"} textColor={"dark"} className={"p-1 me-2"}
                                                style={{fontSize: '0.71rem'}} key={index}>
                                            {roundAmount(amount.value).toString(10) + " " + (amount.currency || "")}
                                        </CBadge>
                                    )
                                })}
                            </div>
                        </div>

                        <div className={"mb-2"}>
                            <small>{t(_str_operation_fees)}</small>
                            <div className={"d-flex align-items-center"}>
                                <div className={"fw-medium me-2"}>{getOperationTotalFees(operation, true)}</div>
                                {operation.fees.map((amount, index) => {
                                    return (
                                        <CBadge size={"sm"} color={"secondary"} textColor={"dark"} className={"p-1 me-2"}
                                                style={{fontSize: '0.71rem'}} key={index}>
                                            {roundAmount(amount.value, 6).toString(10) + " " + (amount.currency || "")}
                                        </CBadge>
                                    )
                                })}
                            </div>
                        </div>

                        <div className={"mb-2"}>
                            <small>{t(_str_transaction_hash)}</small>
                            <div className={"d-flex align-items-center"}>
                                <div className={"fw-medium me-2 one-line w-75"}>
                                    {operation.transaction_hash}
                                </div>
                                <CIcon icon={cilInfo} size={'sm'}
                                       onClick={() => handleOpenOperationBlockchainUrl()}/>
                            </div>
                        </div>

                    </CListGroupItem>
                </CListGroup>
            </>
        ) : (
            <></>
        )
    )
}
