import {useTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router";
import axios from "axios";
import {useEffect, useState} from "react";
import {Asset, AssetMetadata} from "../../../data/assets/assets.dto.ts";
import {CCard, CCardBody, CCol, CRow} from "@coreui/react";
import {Operation} from "../../../data/operations/operations.dto.ts";
import {OperationsRepository} from "../../../data/operations/operations.repository.ts";
import FirstSpinner from "../../components/first_spinner.tsx";
import {OperationsDetailsAssetComponent} from "./components/operations.details.asset.comp.tsx";
import {OperationDetailsOpInfoComponent} from "./components/operation.details.opinfo.comp.tsx";


export default function OperationDetailsView () {
    const {t} = useTranslation();

    const navigate = useNavigate();
    const source = axios.CancelToken.source();

    const [loadingOperation, setLoadingOperation] = useState(false);
    const [asset, setAsset] = useState<Asset | null>(null);
    const [operation, setOperation] = useState<Operation | null>(null);
    const [metadataEvolutions, setMetadataEvolutions] = useState<AssetMetadata[][]>({});

    const { operation_id } = useParams();

    async function getOperation() {
        setLoadingOperation(l => !l);

        const repository = new OperationsRepository(navigate, source.token);
        const response = await repository.getOperationDetails(operation_id);
        if (response) {
            setAsset(response.asset);
            setOperation(response.operation);
            setMetadataEvolutions(response.metadataListEvolutions);
        }

        setLoadingOperation(l => !l);
    }

    function cancelInit() {
        source.cancel();
    }

    useEffect(
        () => {
            getOperation().then();
            return () => cancelInit();
        },
        [operation_id]
    );

    return (
        <>

            <CCard className={'mb-4'}>
                <CCardBody>

                    {loadingOperation ? (
                        FirstSpinner()
                    ) : (
                        <CRow className={'pt-2 pb-3'}>
                            <CCol className={"mb-2 mb-lg-0"} lg={6} md={6} sm={12} xs={12}>
                                <OperationsDetailsAssetComponent
                                    asset={asset}
                                    metadataEvolutions={metadataEvolutions}
                                />
                            </CCol>

                            <CCol className={"mb-2 mb-lg-0"} lg={6} md={6} sm={12} xs={12}>
                                <OperationDetailsOpInfoComponent
                                    operation={operation} />
                            </CCol>
                        </CRow>
                    )}

                </CCardBody>
            </CCard>

        </>
    )
}
