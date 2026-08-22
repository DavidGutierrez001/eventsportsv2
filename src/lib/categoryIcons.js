import { Trophy, Music, Cpu, GraduationCap, UtensilsCrossed, Palette, Briefcase, CalendarDays } from "lucide-react";

export function slugifyCategoria(nombre) {
    if (!nombre) return "";
    return nombre
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, "-");
}

const CATEGORY_ICONS = {
    deportes: Trophy,
    musica: Music,
    tecnologia: Cpu,
    educacion: GraduationCap,
    gastronomia: UtensilsCrossed,
    arte: Palette,
    negocios: Briefcase,
};

const FALLBACK_ICON = CalendarDays;

export function getCategoryIcon(categoria) {
    return CATEGORY_ICONS[slugifyCategoria(categoria)] || FALLBACK_ICON;
}
