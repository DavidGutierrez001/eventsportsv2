"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, MoreVerticalIcon, Trash, Pencil, ImagePlus } from "lucide-react";
import { getEvents, createEvent, updateEvent, deleteEvent, uploadEventImage, deleteEventImage } from "@/services/eventsServices";
import { toast } from "@/components/ui/toast";
import EventDetailDialog from "@/components/EventDetailDialog";

export default function Eventos() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadEvents = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getEvents();
            setEvents(data);
        } catch (error) {
            console.error("Error al obtener eventos:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const data = await getEvents();
                if (!cancelled) setEvents(data);
            } catch (error) {
                console.error("Error al obtener eventos:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    return (
        <>
            <div className="mb-5 flex w-full justify-between">
                <h3 className="text-xl font-medium">Eventos</h3>
                <EventFormDialog onSuccess={loadEvents} />
            </div>
            <EventsTable events={events} loading={loading} onRefresh={loadEvents} />
        </>
    );
}

const EVENT_CATEGORIES = [
    "Deportes",
    "Música",
    "Tecnología",
    "Educación",
    "Gastronomía",
    "Arte",
    "Negocios",
];

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_SIZE_MB = 5;

function EventImageSection({ initialUrl, imageFile, onImageFileChange, removeImage, onRemoveImageChange, disabled }) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const hasCurrentImage = !removeImage && !!initialUrl;
    const shownImage = previewUrl || (hasCurrentImage ? initialUrl : null);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    function clearSelection() {
        setPreviewUrl(null);
        onImageFileChange?.(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    function handleSelectFile(e) {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            toast.add({ title: "Formato no válido", description: "Solo se permiten imágenes JPG, PNG, WEBP o GIF.", type: "error" });
            return;
        }

        if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
            toast.add({ title: "Archivo demasiado grande", description: `La imagen no debe superar ${MAX_IMAGE_SIZE_MB} MB.`, type: "error" });
            return;
        }

        onRemoveImageChange?.(false);
        onImageFileChange?.(file);
        setPreviewUrl(URL.createObjectURL(file));
    }

    function handleRemove() {
        clearSelection();
        onRemoveImageChange?.(true);
    }

    function handleUndoRemove() {
        onRemoveImageChange?.(false);
    }

    return (
        <Field>
            <Label>Imagen</Label>
            {shownImage ? (
                <img
                    src={shownImage}
                    alt="Imagen del evento"
                    className="h-40 w-full rounded-md border object-cover"
                />
            ) : (
                <div className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed text-muted-foreground">
                    <ImagePlus className="size-8" strokeWidth={1.2} />
                    <span className="text-xs">{removeImage ? "La imagen se quitará al guardar los cambios" : "El evento no tiene imagen"}</span>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                onChange={handleSelectFile}
                className="hidden"
            />

            <div className="flex flex-wrap gap-2">
                {!imageFile ? (
                    <>
                        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={disabled}>
                            <ImagePlus />
                            {hasCurrentImage ? "Cambiar imagen" : "Subir imagen"}
                        </Button>

                        {hasCurrentImage && (
                            <Button type="button" variant="destructive" size="sm" onClick={handleRemove} disabled={disabled}>
                                Quitar imagen
                            </Button>
                        )}

                        {removeImage && (
                            <Button type="button" variant="ghost" size="sm" onClick={handleUndoRemove} disabled={disabled}>
                                Deshacer
                            </Button>
                        )}
                    </>
                ) : (
                    <>
                        <span className="flex items-center text-sm text-muted-foreground">Nueva imagen seleccionada</span>
                        <Button type="button" variant="ghost" size="sm" onClick={clearSelection} disabled={disabled}>
                            Cancelar selección
                        </Button>
                    </>
                )}
            </div>

            <p className="text-xs text-muted-foreground">
                JPG, PNG, WEBP o GIF · máx. {MAX_IMAGE_SIZE_MB} MB. Los cambios de imagen se aplican al guardar.
            </p>
        </Field>
    );
}

function EventFormInline({ event, onSuccess, onCancel }) {
    const isEditing = !!event;

    const [formData, setFormData] = useState({
        nombre: event?.nombre || "",
        descripcion: event?.descripcion || "",
        categoria: event?.categoria || "",
        fecha: event?.fecha ? new Date(event.fecha).toISOString().slice(0, 16) : "",
        lugar: event?.lugar || "",
        cupo_maximo: event?.cupo_maximo?.toString() || "",
        imagen_url: event?.imagen_url || "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [removeImage, setRemoveImage] = useState(false);
    const [saving, setSaving] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setSaving(true);
        try {
            const payload = {
                nombre: formData.nombre,
                descripcion: formData.descripcion || null,
                categoria: formData.categoria,
                fecha: new Date(formData.fecha).toISOString(),
                lugar: formData.lugar,
                cupo_maximo: parseInt(formData.cupo_maximo, 10),
            };

            if (isEditing) {
                await updateEvent(event._id, payload);

                if (imageFile) {
                    await uploadEventImage(event._id, imageFile);
                } else if (removeImage) {
                    await deleteEventImage(event._id);
                }

                setImageFile(null);
                setRemoveImage(false);
                toast.add({ title: "Evento actualizado", description: `"${payload.nombre}" se actualizó correctamente.`, type: "success" });
            } else {
                const nuevoEvento = await createEvent(payload);

                if (imageFile && nuevoEvento?._id) {
                    await uploadEventImage(nuevoEvento._id, imageFile);
                }

                setImageFile(null);
                setRemoveImage(false);
                toast.add({ title: "Evento creado", description: `"${payload.nombre}" se creó correctamente.`, type: "success" });
            }
            onSuccess?.();
        } catch (error) {
            toast.add({ title: "Error", description: error.message || "No se pudo guardar el evento.", type: "error" });
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="overflow-auto px-5 max-h-[calc(100svh-20rem)]">
            <DialogHeader>
                <DialogTitle className="text-xl">{isEditing ? "Modificar Evento" : "Crear Evento"}</DialogTitle>
                <DialogDescription>
                    {isEditing ? "Edite los campos que desea cambiar." : "Complete los siguientes campos para crear un nuevo evento."}
                </DialogDescription>
            </DialogHeader>

            <FieldGroup className="my-7">
                <Field>
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required maxLength={150} />
                </Field>

                <Field>
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Input type="textarea" id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} maxLength={500} />
                </Field>

                <Field>
                    <Label htmlFor="categoria">Categoría *</Label>
                    <Input id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} required maxLength={100} list="categorias" />
                    <datalist id="categorias">
                        {EVENT_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat} />
                        ))}
                    </datalist>
                </Field>

                <Field>
                    <Label htmlFor="fecha">Fecha *</Label>
                    <Input id="fecha" name="fecha" type="datetime-local" value={formData.fecha} onChange={handleChange} required />
                </Field>

                <Field>
                    <Label htmlFor="lugar">Lugar *</Label>
                    <Input id="lugar" name="lugar" value={formData.lugar} onChange={handleChange} required maxLength={200} />
                </Field>

                <Field>
                    <Label htmlFor="cupo_maximo">Cupo máximo *</Label>
                    <Input id="cupo_maximo" name="cupo_maximo" type="number" min="1" value={formData.cupo_maximo} onChange={handleChange} required />
                </Field>

                <EventImageSection
                    initialUrl={event?.imagen_url}
                    imageFile={imageFile}
                    onImageFileChange={setImageFile}
                    removeImage={removeImage}
                    onRemoveImageChange={setRemoveImage}
                    disabled={saving}
                />
            </FieldGroup>

            <DialogFooter>
                <DialogClose render={<Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>} />
                <Button type="submit" disabled={saving}>
                    {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear evento"}
                </Button>
            </DialogFooter>
        </form>
    );
}

function EventFormDialog({ onSuccess }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={
                <Button variant="default">
                    <Plus className="h-4 w-4" />
                    Nuevo Evento
                </Button>
            }>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl">
                <EventFormInline
                    onSuccess={() => {
                        setOpen(false);
                        onSuccess?.();
                    }}
                    onCancel={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}

function EventRow({ event, onSuccess }) {
    const [openView, setOpenView] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        setDeleting(true);
        try {
            await deleteEvent(event._id);
            toast.add({ title: "Evento eliminado", description: `"${event.nombre}" fue eliminado.`, type: "success" });
            setOpenDelete(false);
            onSuccess?.();
        } catch (error) {
            toast.add({ title: "Error", description: error.message || "No se pudo eliminar el evento.", type: "error" });
        } finally {
            setDeleting(false);
        }
    }

    return (
        <>
            <TableRow className="cursor-pointer" onClick={() => setOpenView(true)}>
                <TableCell>{event?.fecha ? new Date(event.fecha).toLocaleDateString() : "—"}</TableCell>
                <TableCell className="font-medium">{event?.nombre}</TableCell>
                <TableCell>{event?.categoria}</TableCell>
                <TableCell>{event?.lugar}</TableCell>
                <TableCell className="max-w-40 truncate">{event?.descripcion || "—"}</TableCell>
                <TableCell>{event?.inscritos}</TableCell>
                <TableCell>{event?.cupo_maximo}</TableCell>
                <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button variant="ghost" size="icon" className="size-8">
                                    <MoreVerticalIcon />
                                </Button>
                            }>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                                <Pencil />
                                Modificar
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={() => setOpenDelete(true)}
                                variant="destructive"
                                className="flex w-full text-start">
                                <Trash />
                                Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>

            <EventDetailDialog
                event={event}
                open={openView}
                onOpenChange={setOpenView}
                readOnly
            />

            <Dialog open={openEdit} onOpenChange={setOpenEdit} className="w-[calc(100vw-2rem)]!">
                <DialogContent>
                    <EventFormInline
                        event={event}
                        onSuccess={() => { setOpenEdit(false); onSuccess?.(); }}
                        onCancel={() => setOpenEdit(false)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Estás seguro?</DialogTitle>
                        <DialogDescription>
                            Esta acción no se puede deshacer. Se eliminará el evento <strong>&quot;{event.nombre}&quot;</strong> permanentemente.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose render={<Button variant="ghost">Cancelar</Button>} />
                        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                            {deleting ? "Eliminando..." : "Eliminar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

function EventsTable({ events, loading, onRefresh }) {
    if (loading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-10 w-full bg-accent" />
                {Array.from({ length: 10 }).map((_, index) => (
                    <Skeleton key={index} className="h-7 w-full rounded-md bg-accent/60" />
                ))}
            </div>
        );
    }

    return (
        <Table>
            <TableCaption>Eventos</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Lugar</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Inscritos</TableHead>
                    <TableHead>Cupos</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {events?.map((event) => (
                    <EventRow key={event._id} event={event} onSuccess={onRefresh} />
                ))}
            </TableBody>
        </Table>
    );
}
