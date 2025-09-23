# PasskeyButton

Botão principal para login ou registro via Passkey/WebAuthn.

## Props
| Prop     | Tipo         | Descrição                          |
|----------|--------------|------------------------------------|
| children | ReactNode    | Texto ou ícone do botão            |
| variant  | 'default' \| 'create' | Estilo visual do botão    |
| size     | 'md' \| 'lg' | Tamanho do botão                   |
| onClick  | function     | Callback de clique                 |
| disabled | boolean      | Estado desabilitado                |

## Uso

```tsx
<PasskeyButton size="lg">Entrar com Passkey</PasskeyButton>
<PasskeyButton variant="create" size="lg">Criar LogLine ID</PasskeyButton>
```

## Proveniência computável

- Proveniência: LogLine Foundation, Design System LogLine
- Versão: 2025.09
- Proveniência do código: danvoulez/loglineos-railway
- Última auditoria: 2025-09-22