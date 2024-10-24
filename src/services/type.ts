import { AxiosResponse } from "axios"

export interface IResponse extends AxiosResponse {
  code : string
	extParams : string | null
	message : string | null
	object : any
	redirect : string | null
	success : boolean
}

export interface ILoginParams {
  code ?: string;
	credential ?: string;
	email ?: string;
	loginType ?: string;
	password ?: string;
	accessToken ?: string;
	accessTokenSecret ?: string;
	phoneMac ?: string;
}