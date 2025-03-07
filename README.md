📌 Requisitos do Sistema
✅ Requisitos Funcionais (RF)
✔ Deve ser possível criar um usuário.
✔ Deve ser possível identificar o usuário entre as requisições.
✔ Deve ser possível registrar uma refeição, incluindo:
    ➜ Nome
    ➜ Descrição
    ➜ Data e Hora
    ➜ Indicação se está dentro ou fora da dieta
💡 As refeições devem estar associadas a um usuário.
✔ Deve ser possível editar uma refeição, podendo alterar todos os dados acima.
✔ Deve ser possível apagar uma refeição.
✔ Deve ser possível listar todas as refeições de um usuário.
✔ Deve ser possível visualizar os detalhes de uma refeição específica.
✔ Deve ser possível recuperar métricas do usuário, incluindo:
    ➜ Total de refeições registradas
    ➜ Total de refeições dentro da dieta
    ➜ Total de refeições fora da dieta
    ➜ Melhor sequência de refeições dentro da dieta

🔒 Requisitos Não Funcionais (RNF)
✔ O sistema deve garantir que apenas usuários autenticados possam acessar, editar ou excluir suas próprias refeições.
✔ O sistema deve armazenar os dados de forma segura e eficiente.
✔ O sistema deve permitir a recuperação rápida das métricas do usuário.

⚠️ Regras de Negócio (RN)
✔ O usuário só pode visualizar, editar e apagar as refeições que ele criou.