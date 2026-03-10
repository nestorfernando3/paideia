export function getOnlineSessionErrorMessage(error, action) {
    const details = `${error?.code || ''} ${error?.message || ''}`.toUpperCase();

    if (details.includes('SUPABASE ENVIRONMENT VARIABLES ARE MISSING')) {
        return 'Supabase no está configurado en esta app. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.';
    }

    if (details.includes('ANONYMOUS') && details.includes('DISABLED')) {
        return 'El acceso anónimo está deshabilitado en Supabase Auth. Activa Anonymous Sign-Ins en Authentication.';
    }

    if (details.includes('ROW-LEVEL SECURITY') || details.includes('POLICY')) {
        return 'Supabase rechazó la operación por políticas RLS. Aplica el esquema y las policies del proyecto antes de usar sesiones online.';
    }

    if (details.includes('RELATION') && details.includes('TOOL_ENTRIES')) {
        return 'La tabla tool_entries no existe todavía en Supabase. Ejecuta supabase/schema.sql antes de usar sesiones online.';
    }

    if (details.includes('RELATION') && details.includes('SESSIONS')) {
        return 'La tabla sessions no existe todavía en Supabase. Ejecuta supabase/schema.sql antes de usar sesiones online.';
    }

    return `No se pudo ${action}. Verifica la conexión e inténtalo de nuevo.`;
}
