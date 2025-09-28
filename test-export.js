// Script simples para testar as rotas de relatórios (agora retornam JSON)
const http = require('http');

function testRoute(path, description) {
  console.log(`\n🧪 Testando: ${description}`);
  console.log(`📍 Rota: ${path}`);

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: path,
    method: 'GET',
    headers: {
      Authorization: 'Bearer SEU_JWT_TOKEN_AQUI', // Substitua por um token válido
      'Content-Type': 'application/json',
    },
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Status: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log(`🎉 Sucesso! Dados recebidos:`);
        try {
          const jsonData = JSON.parse(data);
          console.log(
            `📊 Total de registros: ${jsonData.data?.total || 'N/A'}`,
          );
          console.log(`📝 Mensagem: ${jsonData.message}`);
        } catch (e) {
          console.log(`📄 Resposta: ${data.substring(0, 200)}...`);
        }
      } else {
        console.log(`❌ Erro na requisição.`);
        console.log(`📄 Resposta: ${data}`);
      }
    });
  });

  req.on('error', (error) => {
    console.log(`❌ Erro de conexão: ${error.message}`);
  });

  req.end();
}

console.log('🚀 Iniciando testes das rotas de relatórios...');
console.log('⚠️  Certifique-se de que o servidor está rodando na porta 3000');
console.log(
  '⚠️  E que você tem um token JWT válido de um usuário ADMIN ou INSPECTOR',
);

// Testar rotas de relatórios
testRoute('/reports/export/inspections', 'Relatório de Vistorias (JSON)');
testRoute(
  '/reports/export/inspections?from=2024-01-01&to=2024-12-31',
  'Relatório de Vistorias com período',
);
testRoute('/reports/export/inspectors', 'Relatório de Inspetores (JSON)');
testRoute('/reports/export/brands', 'Relatório de Marcas Mais Vistoriadas');
testRoute('/reports/export/problems', 'Relatório de Principais Problemas');

console.log('\n📝 Para usar este script:');
console.log('1. Substitua "SEU_JWT_TOKEN_AQUI" por um token válido');
console.log('2. Execute: node test-export.js');
console.log('3. Verifique se o servidor está rodando');
console.log('\n📋 As rotas agora retornam dados em formato JSON:');
console.log('- /reports/export/inspections - Dados detalhados das vistorias');
console.log('- /reports/export/inspectors - Métricas dos inspetores');
console.log(
  '- /reports/export/brands - Marcas mais vistoriadas e taxa de aprovação',
);
console.log('- /reports/export/problems - Principais problemas encontrados');
console.log('- Parâmetros opcionais: ?from=YYYY-MM-DD&to=YYYY-MM-DD');
