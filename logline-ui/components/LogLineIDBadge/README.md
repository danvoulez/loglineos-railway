# LogLineIDBadge

Exibe o LogLine ID computável do usuário e permite copiar o ID.

## Props
| Prop   | Tipo     | Descrição                                    |
|--------|----------|-----------------------------------------------|
| id     | string   | LogLine ID exibido                            |
| onCopy | function | Callback quando botão de copiar é clicado      |

## Uso

```tsx
<LogLineIDBadge id="logline-id://dan.voulezvous.ts.net" onCopy={() => alert('Copiado!')} />
```

## Proveniência computável

- Proveniência: LogLine Foundation, Design System LogLine
- Versão: 2025.09
- Proveniência do código: danvoulez/loglineos-railway
- Última auditoria: 2025-09-22