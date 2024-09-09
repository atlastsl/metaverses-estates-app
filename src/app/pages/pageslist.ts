
export const BASE_PATH = '/metaverses-estates-app';

export const PAGE_LOGIN = BASE_PATH + '/sign-in';
export const PAGE_404 = BASE_PATH + '/404';
export const PAGE_500 = BASE_PATH + '/500';


export const MY_ACCOUNT_PAGE = BASE_PATH + '/my-account';
export const USERS_PAGE = BASE_PATH + '/users';
export const USER_DETAILS_PAGE = BASE_PATH + '/users/:user_id', USER_DETAILS_PAGE_REG = new RegExp(/.*\/users\/(.+)$/, 'i');


export const ASSETS_LIST_PAGE = BASE_PATH + '/assets';
export const ASSET_DETAILS_PAGE = BASE_PATH + '/assets/:asset_id', ASSET_DETAILS_PAGE_REG = new RegExp(/.*\/assets\/(.+)$/, 'i');
export const OPERATIONS_LIST_PAGE = BASE_PATH + '/operations';
export const OPERATION_DETAILS_PATE = BASE_PATH + '/operations/:operation_id', OPERATION_DETAILS_PAGE_REG = new RegExp(/.*\/operations\/(.+)$/, 'i');
export const STAKEHOLDERS_LIST_PAGE = BASE_PATH + '/stakeholders';
export const STAKEHOLDER_DETAILS_PAGE = BASE_PATH + '/stakeholders/:address/:collection';

