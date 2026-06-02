# MM Comércio e Distribuidora — Site Institucional

## Problem Statement (original)
Site vitrine para distribuidora de produtos de limpeza, descartáveis e papéis. Versão pivotada (sem e-commerce). Foco: conversão via WhatsApp.

## Architecture
- Backend: FastAPI + MongoDB (5 endpoints: /categories, /products, /products/:id, /settings, /chat/whatsapp)
- Frontend: React + Tailwind + Shadcn UI
- Sem auth, sem carrinho, sem checkout

## Implemented (Feb 2026)
- Menu simples: Início, Produtos, Sobre, Contato
- Hero com CTA "Falar no WhatsApp" (verde) + foto Azulim
- 5 destaques Azulim: Limpador Perfumado, Limpa Vidros, Multiuso, Desinfetante Super Concentrado, Lava Louças
- Categorias light: Limpeza Geral, Descartáveis, Papéis, Higiene
- "Como comprar" 4 passos
- Página Produtos (catálogo com filtros)
- Detalhe do produto com botão "Quero este produto" → WhatsApp
- Página Sobre + Contato (com redes sociais)
- Botão WhatsApp flutuante grande (label "Fale no WhatsApp") com chat widget
- Redes sociais flutuantes à esquerda (Instagram, Facebook, TikTok — links placeholder)
- WhatsApp 554134032999, mensagem padrão "Oi! Vi o site e gostaria de informações."

## Pending / Next
- Logo oficial (substituir wordmark)
- Links reais das redes sociais (atualmente "#")
- Integração Olist ERP (estrutura no backend pronta para sincronizar produtos/pedidos)
- Cadastro PF/PJ, login Google, cupons e desconto atacado (removidos no pivot)
