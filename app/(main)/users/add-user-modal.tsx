import CustomInput from "@/app/components/form/custom-input";
import { addUser } from "@/app/services/api/user.service";
import { Button, IconPlus, Modal, toast } from "@heroui/react"
import { Dispatch, SetStateAction, SyntheticEvent, useState } from "react"
import z from "zod";

const obligatoryString = z.string().min(1, { error: 'Campo obrigatório' })

const userSchema = z.object({
  name: obligatoryString,
  email: z.string().min(1, { error: 'Campo obrigatório' }).email({ message: 'E-mail inválido' }),
  password: z.string().min(6, { error: 'A senha deve ter no mínimo 6 caracteres' }),
})

export type AddUserForm = z.infer<typeof userSchema>

const initialForm: AddUserForm = {
  name: '',
  email: '',
  password: '',
}

type Props = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  onAdd: () => void
}

const AddUserModal = ({ isOpen, setIsOpen, onAdd }: Props) => {
  const [form, setForm] = useState<AddUserForm>(initialForm)
  const [errors, setErrors] = useState<z.ZodError["issues"] | undefined>();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async (e: SyntheticEvent) => {
    e.preventDefault();

    const validation = userSchema.safeParse(form);
    if (!validation.success) {
      setErrors(validation.error.issues);
      return;
    } else {
      setErrors(undefined)
    }

    try {
      setLoading(true)
      await addUser(form)
      setIsOpen(false)
      clearForm()
      onAdd()
      toast('Usuário criado com sucesso!', { variant: "success" })
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error?.message : "Houve um erro";
      toast(errorMessage, { variant: "danger" })
    } finally {
      setLoading(false)
    }
  }

  const clearForm = () => {
    setForm(initialForm);
    setErrors(undefined);
  }

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
      <Modal.Container>
        <Modal.Dialog>
          <Modal.CloseTrigger onClick={clearForm} isDisabled={loading} />
          <Modal.Header>
            <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
              <IconPlus className="size-5" />
            </Modal.Icon>
            <Modal.Heading>Registrar novo usuário</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <CustomInput
              formState={form}
              setForm={setForm}
              errors={errors}
              path="name"
              type="text"
              placeholder="Nome completo"
              label="Nome"
              fieldPosition="col"
            />
            <CustomInput
              formState={form}
              setForm={setForm}
              errors={errors}
              path="email"
              type="email"
              placeholder="exemplo@email.com"
              label="E-mail"
              fieldPosition="col"
            />
            <CustomInput
              formState={form}
              setForm={setForm}
              errors={errors}
              path="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              label="Senha"
              fieldPosition="col"
            />
          </Modal.Body>
          <Modal.Footer>
            <div className="w-full flex flex-row justify-between">
              <Button onClick={clearForm} slot="close" variant="danger-soft" isDisabled={loading}>
                Cancelar
              </Button>
              <Button onClick={handleConfirm} isDisabled={loading} isPending={loading}>Salvar</Button>
            </div>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}

export default AddUserModal;
