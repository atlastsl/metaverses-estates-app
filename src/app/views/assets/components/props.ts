import {Asset} from "../../../../data/assets/assets.dto.ts";
import {OIDictionary} from "../../../../services/http/http.dto.ts";

export interface AssetDetailsMainInfoProps {
    asset: Asset | null,
    collections: OIDictionary,
    assetsTypes: OIDictionary,
}