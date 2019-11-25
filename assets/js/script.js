$(document).ready(function(){

  //Al click del bottone mi ritorna il valore dell'input e pulisco (se già presente) il contenuto di ".lista"
  //richiamo tramite la funzione "ricerca" la chiamata ajax alla quale passo come query il nome da ricercare
  $("#button-addon2").click(function(){
    $(".lista *").remove();
    var valore = $(".form-control").val();
    ricerca(valore);
  });

  //Funzione "ricerca" con la chiamata ajax da eseguire
  function ricerca (nome){
    $.ajax({
      url: "https://api.themoviedb.org/3/search/movie?api_key=66aeb90ff00ebee2e50dd67451722ef8&language=it-IT&query="+ nome,
      method: "GET",
      success: function(datoRicevuto){
        var arrayRicevuto = datoRicevuto.results;
        var source = $("#template").html();
        var template = Handlebars.compile(source);
        arrayRicevuto.forEach(element => {
          var context = {titolo: element.title, titoloOriginale: element.original_title, lingua: element.original_language, voto: element.vote_average};
          var html = template(context);
          $(".lista").append(html);
        });
      }
    });  
  }
  
});