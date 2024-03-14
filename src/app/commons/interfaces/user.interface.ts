import {FormControl} from "@angular/forms";

export interface IDataUser {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    phone: string
}

export interface IStateExistUser {
    loading: boolean,
    dataUser: IDataUser | null,
    isAddNewUser: boolean
}

export interface IFormCheckExistUser {
    email: FormControl<string | null>
}

export interface IFormAddOrEditUser {
    email: FormControl
    first_name: FormControl
    last_name: FormControl
    phone: FormControl
    owner: FormControl
    roles: FormControl
}
