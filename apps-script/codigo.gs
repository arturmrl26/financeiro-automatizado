/**
 * Financeiro Automatizado — Google Apps Script
 * Recebe dados do n8n via POST e insere na planilha Google Sheets
 * 
 * Repositório: https://github.com/arturmrl26/financeiro-automatizado
 */

function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const aba = ss.getSheetByName("📥 Lançamentos");

    // ── INSERIR novo lançamento
    if (dados.acao === "inserir") {
      const ultimaLinha = Math.max(aba.getLastRow(), 4) + 1;

      // Converte data DD/MM/AAAA para objeto Date
      const partes = dados.data.split("/");
      const data = new Date(parseInt(partes[2]), parseInt(partes[1]) - 1, parseInt(partes[0]));

      aba.getRange(ultimaLinha, 2).setValue(data);
      aba.getRange(ultimaLinha, 3).setValue(dados.tipo);
      aba.getRange(ultimaLinha, 4).setValue(dados.categoria);
      aba.getRange(ultimaLinha, 5).setValue(parseFloat(dados.previsto) || 0);
      aba.getRange(ultimaLinha, 6).setValue(parseFloat(dados.real) || 0);
      aba.getRange(ultimaLinha, 7).setValue(dados.responsavel || "");
      aba.getRange(ultimaLinha, 8).setValue(dados.fixo || "N");
      aba.getRange(ultimaLinha, 9).setValue(parseInt(dados.mes_inicio) || "");
      aba.getRange(ultimaLinha, 10).setValue(parseInt(dados.mes_fim) || "");
      aba.getRange(ultimaLinha, 11).setValue(dados.obs || "");

      return ContentService
        .createTextOutput(JSON.stringify({ status: "ok", linha: ultimaLinha - 4 }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ── ATUALIZAR valor real de lançamento existente
    if (dados.acao === "atualizar_real") {
      const mes = parseInt(dados.data.split("/")[1]);
      const ano = parseInt(dados.data.split("/")[2]);
      const dadosAba = aba.getDataRange().getValues();

      for (let i = 4; i < dadosAba.length; i++) {
        const catLinha = dadosAba[i][3];   // col D = Categoria
        const mesLinha = dadosAba[i][11];  // col L = Mês (auto)
        const anoLinha = dadosAba[i][12];  // col M = Ano (auto)

        if (catLinha === dados.categoria && mesLinha === mes && anoLinha === ano) {
          aba.getRange(i + 1, 6).setValue(parseFloat(dados.real));
          return ContentService
            .createTextOutput(JSON.stringify({ status: "ok", linha: i - 3, categoria: dados.categoria }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }

      return ContentService
        .createTextOutput(JSON.stringify({ status: "nao_encontrado", categoria: dados.categoria }))
        .setMimeType(ContentService.MimeType.JSON);
    }

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "erro", msg: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Teste rápido — acesse a URL do Apps Script no navegador para verificar se está funcionando
function doGet(e) {
  return ContentService
    .createTextOutput("Financeiro Automatizado — Apps Script OK!")
    .setMimeType(ContentService.MimeType.TEXT);
}
