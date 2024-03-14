import {booleanAttribute, Component, EventEmitter, Input, Output} from '@angular/core';
import {DialogModule} from "primeng/dialog";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {CheckboxModule} from "primeng/checkbox";
import {NgForOf} from "@angular/common";
import {IDataUser, IFormCheckExistUser, IStateExistUser} from "../commons/interfaces/user.interface";

enum EStateForm {
    NORMAL,
    ADD_OR_EDIT
}

const _default_exist_state = {
    loading: false,
    dataUser: null,
    isAddNewUser: false
}

@Component({
    selector: 'app-dialog-add-edit-user',
    standalone: true,
    imports: [
        DialogModule,
        ButtonModule,
        InputTextModule,
        ReactiveFormsModule,
        DropdownModule,
        CheckboxModule,
        FormsModule,
        NgForOf
    ],
    templateUrl: './dialog-add-edit-user.component.html',
    styleUrl: './dialog-add-edit-user.component.scss'
})
export class DialogAddEditUserComponent {
    @Input({required: true, transform: booleanAttribute}) visible !: boolean
    @Output() visibleChange = new EventEmitter<boolean>()

    protected roles = ['Admin', 'Employee', 'Operator']

    formGroupUser!: any
    formExistUser!: any

    stateForm = EStateForm.NORMAL

    protected getIsFieldInvalid(field: string) {
        return this.formGroupUser.get(field)?.touched && this.formGroupUser.get(field)?.dirty && this.formGroupUser.get(field)?.invalid
    }

    protected stateExistDataUser: IStateExistUser = JSON.parse(JSON.stringify(_default_exist_state))

    async handleCheckExistUser() {
        this.markFormGroupTouchedEvent(this.formExistUser)

        if (this.formExistUser.valid) {
            this.formExistUser.get("email")?.disable()
            const valueEmail = this.formExistUser.value.email

            this.stateExistDataUser.loading = true

            const data: IDataUser | null = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    const simulateDataUserExist = {
                        id: 1,
                        first_name: "Trung",
                        last_name: "Tran",
                        email: `123@gmail.com`,
                        phone: "091133623"
                    }

                    if (valueEmail === simulateDataUserExist.email) {
                        resolve(simulateDataUserExist)
                    } else {
                        resolve(null)
                    }

                    this.formExistUser.get("email")?.enable()
                }, 3000)
            })

            if (data) {
                this.formGroupUser.reset({...data})
                this.stateExistDataUser.isAddNewUser = false
                this.stateForm = EStateForm.ADD_OR_EDIT
            } else {
                this.initialFormGroupUser()
                this.formGroupUser.patchValue({
                    email: valueEmail
                })
                this.formGroupUser.get("email").disable()
                this.stateExistDataUser.isAddNewUser = true
            }

            this.stateExistDataUser = {
                ...this.stateExistDataUser,
                loading: false,
                dataUser: data,
            }
        }
    }

    constructor() {
        this.initialFormGroupUser()

        this.formExistUser = new FormGroup<IFormCheckExistUser>({
            email: new FormControl("", [Validators.required, Validators.email])
        })
    }

    protected onSubmit() {
        this.markFormGroupTouchedEvent(this.formGroupUser)

        if (this.formGroupUser.valid) {
            console.log(this.formGroupUser.value)
        }
    }

    onAddNewUser() {
        this.stateForm = EStateForm.ADD_OR_EDIT
    }

    handleCloseDialog() {
        this.formExistUser.reset({})
        this.formGroupUser.reset({})
        this.formExistUser.markAsPristine()
        this.formGroupUser.markAsPristine()

        this.stateExistDataUser = JSON.parse(JSON.stringify(_default_exist_state))
        this.stateForm = EStateForm.NORMAL

        this.visibleChange.emit(false)
    }

    private initialFormGroupUser() {
        this.formGroupUser = new FormGroup({
            email: new FormControl("", [Validators.required, Validators.email]),
            first_name: new FormControl("", [Validators.required]),
            last_name: new FormControl("", [Validators.required]),
            phone: new FormControl("", [Validators.required]),
            owner: new FormControl(false),
            roles: new FormControl([])
        })
    }

    private markFormGroupTouchedEvent(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => {
            if (control instanceof FormGroup) {
                this.markFormGroupTouchedEvent(control);
            } else {
                control.markAsTouched();
                control.markAsDirty();
            }
        });
    }

    protected readonly EStateForm = EStateForm;
}
