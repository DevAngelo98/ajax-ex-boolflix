$(document).ready(function(){

  //Cambio stile bandiera all'hover
  $(".container").on("mouseenter", ".flaghover", function(){
    $(this).addClass("none");
    $(this).parent().find(".flagnohover").removeClass("none");
  });

  $(".container").on("mouseleave", ".flagnohover", function(){
    $(this).addClass("none");
    // // $(this).addClass("block");
    $(this).parent().find(".flaghover").removeClass("none");
  });

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
      url: "https://api.themoviedb.org/3/search/movie?api_key=66aeb90ff00ebee2e50dd67451722ef8&query="+ nome,
      method: "GET",
      success: function(datoRicevuto){
        $(".form-control").val("");
        var arrayRicevuto = datoRicevuto.results;
        var source = $("#template").html();
        var template = Handlebars.compile(source);
        arrayRicevuto.forEach(element => {
          // stella = '<svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-star fa-w-18 fa-3x"><path fill="currentColor" d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM405.8 317.9l27.8 162L288 403.5 142.5 480l27.8-162L52.5 203.1l162.7-23.6L288 32l72.8 147.5 162.7 23.6-117.7 114.8z" class=""></path></svg>';
          var votoFinale = conversioneVoto(element.vote_average);
          var context = {
            titolo: element.title, 
            titoloOriginale: element.original_title, 
            lingua: bandiera(element.original_language), 
            voto: votoFinale,
            stars: stelle(votoFinale)
          };
          var html = template(context);
          // console.log(html);
          // stelle(votoFinale);
          $(".lista").append(html);
        });
      }
    });  
  }

  
  function conversioneVoto (voto){
    var votoDivisoPerDue = voto/2;
    var votoFinale = parseInt(votoDivisoPerDue);
    return votoFinale;
  }

  function bandiera(lingua){
    var linguaUpper = lingua.toUpperCase();
    if (linguaUpper == "EN"){
      linguaUpper = "GB";
    } else if(linguaUpper=="CS"){
      linguaUpper = "CZ";
    } else if (linguaUpper=="JA"){
      linguaUpper = "JP";
    }
    return linguaUpper;
  }


  function stelle(voto){

    var init="";

    for(j=0; j<voto; j++){
      stella = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-star fa-w-18 fa-3x"><path fill="black" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" class=""></path></svg>';
      init+=stella;
    }

    var stella = '<svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-star fa-w-18 fa-3x"><path fill="currentColor" d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM405.8 317.9l27.8 162L288 403.5 142.5 480l27.8-162L52.5 203.1l162.7-23.6L288 32l72.8 147.5 162.7 23.6-117.7 114.8z" class=""></path></svg>';  
    
    for(var i=0; i<5-voto; i++){
      init+=stella;
    }

    return init;
  
  }
});