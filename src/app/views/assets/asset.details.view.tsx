// @ts-nocheck
import {useNavigate, useParams} from "react-router";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {OIDictionary} from "../../../services/http/http.dto.ts";
import {CCard, CCardBody, CCol, CRow} from "@coreui/react";
import FirstSpinner from "../../components/first_spinner.tsx";
import {AssetsRepository} from "../../../data/assets/assets.repository.ts";
import {AssetDetailsMainInfoComponent} from "./components/asset.details.main.info.comp.tsx";
import {Asset} from "../../../data/assets/assets.dto.ts";
import {AssetDetailsScnInfoComponent} from "./components/asset.details.scn.info.comp.tsx";
import {AssetDetailsMetadataComponent} from "./components/asset.details.metadata.comp.tsx";
import {AssetDetailsOperationsComp} from "./components/asset.details.operations.comp.tsx";


export default function AssetsDetailView() {

    const navigate = useNavigate();
    const source = axios.CancelToken.source();

    const [loadingAsset, setLoadingAsset] = useState(false);
    const [asset, setAsset] = useState<Asset | null>(null);
    const [collections, setCollections] = useState<OIDictionary>({});
    const [assetsTypes, setAssetsTypes] = useState<OIDictionary>({});

    const { asset_id } = useParams();

    async function getAsset() {
        setLoadingAsset(l => !l);

        const repository = new AssetsRepository(navigate, source.token);
        const response1 = await repository.getAsset(asset_id as string);
        if (response1) {
            setAsset(response1.asset);
        }
        const response2 = await repository.getCollections();
        if (response2) {
            setCollections(response2.collections);
        }
        if (response1.asset) {
            const response3 = await repository.getAssetsTypes(response1.asset.collection);
            if (response3) {
                setAssetsTypes(response3.assets_types);
            }
        }

        setLoadingAsset(l => !l);
    }

    function cancelInit() {
        source.cancel();
    }

    useEffect(
        () => {
            getAsset().then();
            return () => cancelInit();
        },
        [asset_id]
    );

    return (
        <>

            <CCard className='mb-4'>
                <CCardBody className={'pt-3 pb-2'}>

                    { loadingAsset ? (
                        FirstSpinner()
                    ) : (
                        <>

                            <AssetDetailsMainInfoComponent
                                asset={asset}
                                collections={collections}
                                assetsTypes={assetsTypes}
                                />

                            <CRow>
                                <CCol className={"mb-2 mb-lg-0"}  lg={4} md={4} sm={12} xs={12}>
                                    <AssetDetailsScnInfoComponent
                                        asset={asset}
                                        collections={collections}
                                        assetsTypes={assetsTypes} />
                                </CCol>

                                <CCol className={"mb-2 mb-lg-0"}  lg={8} md={8} sm={12} xs={12}>
                                    <AssetDetailsMetadataComponent
                                        asset={asset}
                                        collections={collections}
                                        assetsTypes={assetsTypes} />
                                </CCol>
                            </CRow>

                            <AssetDetailsOperationsComp
                                asset={asset}
                                collections={collections}
                                assetsTypes={assetsTypes}
                            />

                        </>
                    ) }

                </CCardBody>
            </CCard>

        </>
    )
}