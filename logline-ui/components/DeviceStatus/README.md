# DeviceStatus

Indica visualmente quais sensores estão ativos/detectados no dispositivo do usuário.

## Props
| Prop    | Tipo    | Descrição                   |
|---------|---------|-----------------------------|
| passkey | boolean | Passkey/WebAuthn detectado  |
| camera  | boolean | Câmera detectada            |
| nfc     | boolean | NFC detectado               |
| mic     | boolean | Microfone detectado         |

## Uso

```tsx
<DeviceStatus passkey={true} camera={false} nfc={true} mic={false} />
```

## Proveniência computável

- Proveniência: LogLine Foundation, Design System LogLine
- Versão: 2025.09
- Proveniência do código: danvoulez/loglineos-railway
- Última auditoria: 2025-09-22