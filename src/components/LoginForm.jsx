"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useForm, Controller } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner"

import { useAuth } from "@/context/AuthContext";

import { EyeClosed, Eye } from "lucide-react";

// Esquema de validación para el formulario de inicio de sesión
const formSchema = z.object({
    email: z
        .string()
        .min(1, "Por favor ingresa el correo electrónico."),

    password: z
        .string()
        .min(6, "La contraseña debe tener al menos 6 carácteres.")
});


// Componente de inicio de sesión
export default function LoginForm() {

    const router = useRouter();
    const { login } = useAuth();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    // Funcion asincrona para manejar el envio del formulario
    async function onSubmit(values) {
        try {
            await login(values.email, values.password);
            router.push("/");
        }
        catch (error) {
            form.setError("root.serverError", {
                type: "manual",
                message: "Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.",
            });
        }
    }

    const [passwordVisible, setPasswordVisible] = useState(false);

    function togglePasswordVisibility() {
        setPasswordVisible(!passwordVisible);
    }

    return (
        <>
            <section className="flex w-full max-w-80 flex-col space-y-6 animate-in fade-in-0 duration-300">
                <form
                    className="flex flex-col gap-5"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <h2 className="text-4xl md:text-3xl font-bold md:font-semibold">Iniciar sesión</h2>
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Correo electrónico</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="email"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="email"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Contraseña</FieldLabel>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type={passwordVisible ? "text" : "password"}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="current-password"
                                    />
                                    <Button
                                        id="togglePassword"
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-2 top-1/2 -translate-y-1/2"
                                    >
                                        {
                                            passwordVisible ? (
                                                <Eye className="size-4" />
                                            ) : (
                                                <EyeClosed className="size-4" />
                                            )
                                        }
                                    </Button>

                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {form.formState.errors.root?.serverError && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.root.serverError.message}
                        </p>
                    )}

                    <Button
                        className="group relative h-14 overflow-hidden px-1"
                        type="submit"
                        variant="secondary"
                    >
                        {isSubmitting ? <Spinner /> : "Iniciar sesión"}
                    </Button>
                </form>
            </section>
            <section className="flex flex-col gap-3 w-full max-w-84">
                <p className="text-sm text-muted-foreground flex flex-col justify-center items-center my-5">
                    ¿No tienes una cuenta?
                    <Link
                        href="/register"
                        className="text-primary hover:underline underline-offset-4 hover:text-primary/80 transition-colors"
                    >
                        Regístrarse
                    </Link>
                </p>
                <Separator />
            </section>
        </>
    );
}
