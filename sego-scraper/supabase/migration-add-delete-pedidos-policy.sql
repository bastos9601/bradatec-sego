-- Agregar política para que los admins puedan eliminar pedidos
CREATE POLICY "Los admins pueden eliminar pedidos"
ON pedidos
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM perfiles
    WHERE perfiles.id = auth.uid()
    AND perfiles.rol = 'admin'
  )
);
