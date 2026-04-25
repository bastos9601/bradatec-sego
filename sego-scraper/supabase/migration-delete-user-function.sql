-- Crear función RPC para eliminar usuario completamente
-- Esta función elimina el usuario de auth.users y de la tabla perfiles

CREATE OR REPLACE FUNCTION delete_user_account(user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Eliminar de la tabla perfiles primero
  DELETE FROM perfiles WHERE id = user_id;
  
  -- Eliminar de auth.users (requiere ser admin o usar service role)
  DELETE FROM auth.users WHERE id = user_id;
  
  -- Retornar resultado
  result := json_build_object(
    'success', true,
    'message', 'Usuario eliminado correctamente',
    'user_id', user_id
  );
  
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  result := json_build_object(
    'success', false,
    'message', SQLERRM,
    'user_id', user_id
  );
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dar permisos al rol authenticated para ejecutar la función
GRANT EXECUTE ON FUNCTION delete_user_account(UUID) TO authenticated;

-- Crear política RLS para que solo admins puedan eliminar usuarios
CREATE POLICY "Solo admins pueden eliminar usuarios"
ON perfiles
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM perfiles
    WHERE id = auth.uid() AND rol = 'admin'
  )
);
