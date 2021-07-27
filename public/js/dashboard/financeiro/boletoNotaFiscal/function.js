/**
 * FUNCTION
 * Script responsável pelas operações de funções dentro da interfase.
 * 
 * @author    Manoel Louro
 * @date      10/03/2021
 */

/**
 * FUNCTION
 * Constroi estatistica semestral de boletos LIQUIDADOS dentro do sistema.
 * 
 * @author    Manoel Louro
 * @date      10/03/2021
 */
async function setDashFinanceiroBoletoEstatisticaSemestralBoleto() {
    //TOTAL REGISTRO
    const totalRegistro = await getDashFinanceiroBoletoEstatisticaTotalBoletoAJAX();
    $('#dashFinanceiroBoletoCardBoletoTotal').html(totalRegistro);
    animateContador($('#dashFinanceiroBoletoCardBoletoTotal'));
    //SEMESTRAL
    const semestral = await getDashFinanceiroBoletoEstatisticaSemestralBoletoAJAX();
    $('#dashFinanceiroBoletoCardBoletoTabela').html('');
    new Chartist.Bar('#dashFinanceiroBoletoCardBoletoTabela', {
        labels: [getMesNome(6).substring(0, 3), getMesNome(5).substring(0, 3), getMesNome(4).substring(0, 3), getMesNome(3).substring(0, 3), getMesNome(2).substring(0, 3), getMesNome(1).substring(0, 3)],
        series: [
            semestral
        ]
    }, {
        seriesBarDistance: 20,
        reverseData: true,
        horizontalBars: true,
        axisY: {
            onlyInteger: true,
            offset: 20
        },
        axisX: {
            onlyInteger: true,
            offset: 20
        }
    });
    //TOTAL LIQUIDADOS
    const totalLiquidado = await getDashFinanceiroBoletoEstatisticaTotalBoletoLiquidadoAJAX();
    $('#dashFinanceiroBoletoCardBoletoTotalMes').html(totalLiquidado);
    animateContador($('#dashFinanceiroBoletoCardBoletoTotalMes'));
    $('#dashFinanceiroBoletoCardBoletoBlock').fadeOut(50);
}

/**
 * FUNCTION
 * Constroi lista de boletos com remessa pendente.
 * 
 * @author    Manoel Louro
 * @date      10/04/2021
 */
async function setDashFinanceiroBoletoListaBoleto() {
    $('#dashFinanceiroBoletoCardTabelaBoletoBlock').fadeOut(50);
    $('#dashFinanceiroBoletoCardTabelaBoleto').html('<div style="margin-top: -30px"><div class="spinnerCustom"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div><p class="font-11 text-center mb-0">Buscando registros ...</p></div>');
    const listaRegistro = await getDashFinanceiroBoletoListaControleAJAX();
    await sleep(300);
    if (listaRegistro['listaRegistro'] && listaRegistro['listaRegistro'].length > 0) {
        $('#dashFinanceiroBoletoCardTabelaBoleto').html('');
        for (var i = 0; i < listaRegistro['listaRegistro'].length; i++) {
            $('#dashFinanceiroBoletoCardTabelaBoleto').append(setDashFinanceiroBoletoRegistroBoletoHTML(listaRegistro['listaRegistro'][i]));
            if (i < 15) {
                await sleep(50);
            }
        }
    } else {
        $('#dashFinanceiroBoletoCardTabelaBoleto').html('<div class="col-12 text-center" style="padding-top: 103px"><p class="font-11">- Nenhum boleto gerado -</p></div>');
    }
    $('#dashFinanceiroBoletoCardTabelaBoletoBlock').fadeOut(50);
}

/**
 * FUNCTION
 * Constroi elemento HTML de visualização do registro informado.
 * 
 * @author    Manoel Louro
 * @date      10/03/2021
 */
function setDashFinanceiroBoletoRegistroBoletoHTML(registro) {
    var html = '';
    var estadoRegistro = '';
    if (registro['fkRemessa'] == null) {
        estadoRegistro = 'situacaoRemessaPendente';
    } else {
        switch (parseInt(registro['estadoRegistro'])) {
            case 2://AGUARDANDO PAGAMENTO
                estadoRegistro = 'situacaoPagamentoPendente';
                break;
            case 3://PAGAMENTO EFETUADO
                estadoRegistro = 'situacaoPagamentoConcluido';
                break;
            case 4://REGISTRO CANCELADO
                estadoRegistro = 'situacaoRegistroCancelado';
                break;
        }

    }
    html += '<div class="d-flex no-block div-registro ' + estadoRegistro + '" style="padding-left: 11px;margin-bottom: 1px;padding-top: 8px;padding-bottom: 5px;cursor: pointer;animation: slide-up .3s ease" onclick="getCardBoletoConsultar(' + registro['boletoID'] + ', this)">';
    html += '   <div class="text-truncate" style="width: 45px; margin-right: 10px">';
    html += '       <p class="color-default mb-0 font-11 text-truncate" style="margin-bottom: 0px">#' + registro['boletoID'] + '</p>';
    html += '   </div>';
    html += '   <div class="text-truncate" style="margin-right: 10px;width: 140px">';
    switch (registro['origemBoleto']) {
        case 'cabeamento_adicional':
            html += '<p class="color-default mb-0 font-11 text-truncate" style="margin-bottom: 0px"><i class="mdi mdi-plus-network"></i> Cabeamento Adicional</p>';
            break;
        case 'troca_ponto':
            html += '<p class="color-default mb-0 font-11 text-truncate" style="margin-bottom: 0px"><i class="mdi mdi-access-point-network"></i> Mudança de Ponto</p>';
            break;
        default:
            html += '<p class="text-dark mb-0 font-11 text-truncate" style="margin-bottom: 0px"><i class="mdi mdi-information-outline"></i> Não identificado</p>';
            break;
    }
    html += '   </div>';
    html += '   <div class="text-truncate" style="margin-right: 10px;width: 68px">';
    html += '       <p class="color-default mb-0 font-11" style="margin-bottom: 0px">' + (registro['valorBoleto']).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) + '</p>';
    html += '   </div>';
    html += '   <div class="text-truncate d-none d-md-block">';
    html += '       <p class="color-default mb-0 font-11 text-truncate" style="margin-bottom: 0px"><i class="mdi mdi-account-box"></i> ' + registro['clienteNome'] + '</p>';
    html += '   </div>';
    html += '   <div class="d-flex ml-auto">';
    html += '       <div class="text-truncate d-none d-sm-block" style="margin-left: 10px;width: 130px">';
    if (registro['fkRemessa'] == null) {
        html += '       <p class="text-orange mb-0 font-11" style="margin-bottom: 0px"><i class="mdi mdi mdi-hexagon-multiple"></i> Aguardando remessa</p>';
    } else {
        switch (parseInt(registro['estadoRegistro'])) {
            case 2: //AGUARDANDO PAGAMENTO
                html += '<p class="text-info mb-0 font-11" style="margin-bottom: 0px"><i class="mdi mdi mdi-hexagon-multiple"></i> Aguardando pagamento</p>';
                break;
            case 3: //PAGAMENTO EFETUADO
                html += '<p class="text-success mb-0 font-11" style="margin-bottom: 0px"><i class="mdi mdi mdi-hexagon-multiple"></i> Pagamento efetuado</p>';
                break;
            case 4://REGISTRO CANCELADO
                html += '<p class="text-muted mb-0 font-11" style="margin-bottom: 0px"><i class="mdi mdi mdi-hexagon-multiple"></i> Boleto cancelado</p>';
                break;
            default:
                html += '<p class="text-dark mb-0 font-11" style="margin-bottom: 0px"><i class="mdi mdi mdi-hexagon-multiple"></i> Erro interno</p>';
                break;
        }
    }
    html += '       </div>';
    html += '   </div>';
    html += '</div>';
    return html;
}

/**
 * FUNCTION
 * Constroi lista de Nota Fiscal que estejam pendentes dentro do sistema.
 * 
 * @author    Manoel Louro
 * @date      10/04/2021
 */
async function setDashFinanceiroBoletoListaNfs() {
    $('#dashFinanceiroBoletoCardTabelaNfsBlock').fadeOut(50);
    $('#dashFinanceiroBoletoCardTabelaNfs').html('<div style="margin-top: -30px"><div class="spinnerCustom"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div><p class="font-11 text-center mb-0">Buscando registros ...</p></div>');
    const listaRegistro = await getDashFinanceiroBoletoListaNfsJAX();
    await sleep(300);
    if (listaRegistro['listaRegistro'] && listaRegistro['listaRegistro'].length > 0) {
        $('#dashFinanceiroBoletoCardTabelaNfs').html('');
        for (var i = 0; i < listaRegistro['listaRegistro'].length; i++) {
            $('#dashFinanceiroBoletoCardTabelaNfs').append(setDashFinanceiroBoletoRegistroNfsHTML(listaRegistro['listaRegistro'][i]));
            if (i < 15) {
                await sleep(50);
            }
        }
    } else {
        $('#dashFinanceiroBoletoCardTabelaNfs').html('<div class="col-12 text-center" style="padding-top: 103px"><p class="font-11">- Nenhuma NFS-e pendente -</p></div>');
    }
    $('#dashFinanceiroBoletoCardTabelaNfsBlock').fadeOut(50);
}

/**
 * FUNCTION
 * Constroi elemento HTML de visualização do registro informado.
 * 
 * @author    Manoel Louro
 * @date      10/03/2021
 */
function setDashFinanceiroBoletoRegistroNfsHTML(registro) {
    var html = '';
    var estadoRegistro = '';
    switch (parseInt(registro['estadoRegistro'])) {
        case 1://NFSE PENDENTE
            estadoRegistro = 'situacaoPagamentoPendente';
            break;
        case 2://NFSE EMITIDA
            estadoRegistro = 'situacaoPagamentoConcluido';
            break;
        case 3://NFS CANCELADA
            estadoRegistro = 'situacaoRegistroCancelado';
            break;
    }
    html += '<div class="d-flex no-block div-registro ' + estadoRegistro + '" style="padding-left: 11px;margin-bottom: 1px;padding-top: 8px;padding-bottom: 5px;cursor: pointer;animation: slide-up .3s ease" onclick="getCardFinanceiroNfseRpsConsultar(' + registro['id'] + ', this)">';
    html += '   <div class="text-truncate" style="width: 45px; margin-right: 10px">';
    html += '       <p class="color-default mb-0 font-11 text-truncate" style="margin-bottom: 0px">#' + registro['id'] + '</p>';
    html += '   </div>';
    html += '   <div class="text-truncate" style="margin-right: 10px;width: 140px">';
    switch (registro['origemDescricao']) {
        case 'cabeamento_adicional':
            html += '<p class="color-default mb-0 font-11 text-truncate" style="margin-bottom: 0px"><i class="mdi mdi-plus-network"></i> Cabeamento Adicional</p>';
            break;
        case 'troca_ponto':
            html += '<p class="color-default mb-0 font-11 text-truncate" style="margin-bottom: 0px"><i class="mdi mdi-access-point-network"></i> Mudança de Ponto</p>';
            break;
        default:
            html += '<p class="text-dark mb-0 font-11 text-truncate" style="margin-bottom: 0px"><i class="mdi mdi-information-outline"></i> Não identificado</p>';
            break;
    }
    html += '   </div>';
    html += '   <div class="text-truncate" style="margin-right: 10px;width: 68px">';
    html += '       <p class="color-default mb-0 font-11" style="margin-bottom: 0px">' + (registro['valorServico']).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) + '</p>';
    html += '   </div>';
    html += '   <div class="text-truncate d-none d-md-block">';
    html += '       <p class="color-default mb-0 font-11 text-truncate" style="margin-bottom: 0px"><i class="mdi mdi-account-box"></i> ' + registro['clienteNome'] + '</p>';
    html += '   </div>';
    html += '   <div class="d-flex ml-auto">';
    html += '       <div class="text-truncate d-none d-sm-block" style="margin-left: 10px;width: 130px">';
        switch (parseInt(registro['estadoRegistro'])) {
            case 1: //NFS PENDENTE
                html += '<p class="text-orange mb-0 font-11" style="margin-bottom: 0px"><i class="mdi mdi mdi-hexagon-multiple"></i> Emissão pendente</p>';
                break;
            case 2: //NFS EMITIDA
                html += '<p class="text-success mb-0 font-11" style="margin-bottom: 0px"><i class="mdi mdi mdi-hexagon-multiple"></i> NFS-e emitida</p>';
                break;
            case 3://NFS CANCELADA
                html += '<p class="text-muted mb-0 font-11" style="margin-bottom: 0px"><i class="mdi mdi mdi-hexagon-multiple"></i> NFS-e cancelada</p>';
                break;
            default:
                html += '<p class="text-dark mb-0 font-11" style="margin-bottom: 0px"><i class="mdi mdi mdi-hexagon-multiple"></i> Erro interno</p>';
                break;
    }
    html += '       </div>';
    html += '   </div>';
    html += '</div>';
    return html;
}

/**
 * FUNCTION
 * Constroi estatistica semestral de NFSE emitidas/cadastradas
 * 
 * @author    Manoel Louro
 * @date      10/04/2021
 */
async function setDashFinanceiroBoletoEstatisticaSemestralNfs() {
    //TOTAL REGISTRO
    const totalRegistro = await getDashFinanceiroBoletoEstatisticaTotalNfsAJAX();
    $('#dashFinanceiroBoletoCardNfsTotal').html(totalRegistro);
    animateContador($('#dashFinanceiroBoletoCardNfsTotal'));
    //SEMESTRAL
    const semestral = await getDashFinanceiroBoletoEstatisticaSemestralNfsAJAX();
    $('#dashFinanceiroBoletoCardNfsTabela').html('');
    new Chartist.Bar('#dashFinanceiroBoletoCardNfsTabela', {
        labels: [getMesNome(6).substring(0, 3), getMesNome(5).substring(0, 3), getMesNome(4).substring(0, 3), getMesNome(3).substring(0, 3), getMesNome(2).substring(0, 3), getMesNome(1).substring(0, 3)],
        series: [
            semestral
        ]
    }, {
        seriesBarDistance: 20,
        reverseData: true,
        horizontalBars: true,
        axisY: {
            onlyInteger: true,
            offset: 20
        },
        axisX: {
            onlyInteger: true,
            offset: 20
        }
    });
    //TOTAL LIQUIDADOS MES
    const totalEmitido = await getDashFinanceiroBoletoEstatisticaTotalNfsEmitidaAJAX();
    $('#dashFinanceiroBoletoCardNfsEmitidaTotal').html(totalEmitido);
    animateContador($('#dashFinanceiroBoletoCardNfsEmitidaTotal'));
    $('#dashFinanceiroBoletoCardNfsBlock').fadeOut(50);
}

////////////////////////////////////////////////////////////////////////////////
//                            - INTERNAL FUNCTION -                           //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

/**
 * FUNCTION INTERNAL
 * Aninação de contagem através de elemento informado
 * 
 * @author    Manoel Louro
 * @date      10/03/2021
 */
function animateContador(element) {
    var $this = $(element);
    jQuery({Counter: 0}).animate({Counter: $this.text()}, {
        duration: 1000,
        easing: 'swing',
        step: function () {
            $this.text(Math.ceil(this.Counter));
        }
    });
}

/**
 * INTERNAL FUNCTION
 * Retorna nome do mes baseado na data atual.
 * 
 * @author    Manoel Louro
 * @date      10/03/2021
 */
function getMesNome(retirarMes) {
    var date = new Date();
    date.setMonth(date.getMonth() - retirarMes);
    monthName = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    return monthName[date.getMonth()];
}

