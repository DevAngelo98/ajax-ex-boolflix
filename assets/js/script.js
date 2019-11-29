$(document).ready(function(){

  //Cambio stile bandiera all'hover
  $(".info-film-serie").on("mouseenter", ".flaghover", function(){
    $(this).addClass("none");
    $(this).parent().find(".flagnohover").removeClass("none");
  });

  $(".info-film-serie").on("mouseleave", ".flagnohover", function(){
    $(this).addClass("none");
    $(this).parent().find(".flaghover").removeClass("none");
  });

  //Al click del bottone mi ritorna il valore dell'input e pulisco (se già presente) il contenuto di ".lista"
  //richiamo tramite la funzione "ricerca" la chiamata ajax alla quale passo come query il nome da ricercare
  var ricercaVal;
  $("#button-addon2").click(function(){
    ricercaVal=0;
    var valore = $(".form-control").val();
    ricerca(valore);
  });

  //Click sul film/serie e mostro info
  $(".container").on("mouseenter", "ul .img", function(){
    $(this).find(".info").addClass("flex");
  });

  $(".container").on("mouseleave", "ul .img", function(){
    $(this).find(".info").removeClass("flex");  
  });

  //Clone delle informazioni
  $(".container").on("click", ".img", function(){
    var copia = $(this).parent().parent().clone().addClass("copiato");
    $(".info-film-serie").html(copia);
    noNone(".info-film-serie");
    classFlex(".info-film-serie");
    noNone(".info-film-serie .descr");
    classFlex(".info-film-serie .descr");
    noNone(".info-film-serie .descrizione");
    siNone(".container.lista");
    siNone(".container.listaserie");
    siNone(".bd-example");
  });

  //Ripristino ricerca
  $("body").on("click", ".closedescrizione", function(){
    $(".info-film-serie").removeClass("flex");
    siNone(".info-film-serie");
    noNone(".container.lista");
    noNone(".container.listaserie");
    noNone(".bd-example");
  });

  ricerca("breaking bad");

  //Funzione ricerca cast
  function cercaCast(id){
    var url = id+"/credits?api_key=66aeb90ff00ebee2e50dd67451722ef8";
    $.ajax({
      // https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key=<<api_key>>
      url: "https://api.themoviedb.org/3/movie/"+url,
      method: "GET",
      success: function(castRicevuto){
        var arrayCast = castRicevuto.cast;
        var elem = "."+id;
        var cont=0;
        if(arrayCast.length>0) $(elem).find(".attori").append("<li><b>Attori:</b></li>");
        arrayCast.forEach(element => {
          if(cont<5){
            $(elem).find(".attori").append("<li>"+element.name+"</li>");
            cont++;
          }
        });
      }
    });
  }

  //Cerca generi
  function cercaGeneri(id){
    var url = id+"?api_key=66aeb90ff00ebee2e50dd67451722ef8";
    $.ajax({
      url: "https://api.themoviedb.org/3/movie/"+url,
      method: "GET",
      success: function(generiRicevuti){
        console.log(id);
        
        console.log(generiRicevuti.genres);
        var arrayGeneri = generiRicevuti.genres;
        var elem = "."+id;
        var cont=0;
        var nomi="";
        // if(arrayGeneri.length>0) $(elem).find(".generi").append("<li><b>Generi:</b></li>");
        arrayGeneri.forEach(element => {
          if(cont<5){
            if (cont==0){
              nomi+="<br>"+"<b>Generi:</b>"+"&nbsp";
            }
            // nomi+=element.name+", ";
            cont++;
            if(cont==arrayGeneri.length){
              nomi+=element.name;
            } else {
              nomi+=element.name+", ";
            }
          }
          if(nomi!=null && nomi!=undefined){
            $(elem).find(".generi").html(nomi);
          }
        });
      }
    });
  }

  // Funzione generale ricerca e controllo img
  
  function controllo(id,backdrop,context,tipo,template){
    cercaCast(id);
    cercaGeneri(id);
    controlloImg(backdrop,context);
    if(tipo=="movie") {
      var html = template(context);
      $(".lista .film").append(html);  
    } else if (tipo=="tv"){
      var html = template(context);
      $(".listaserie .serie").append(html);
    }
  }

  //Funzione "ricerca" con le chiamata ajax da eseguire
  function ricerca (nome){

    //Chiamata generale
    $.ajax({
      url: "https://api.themoviedb.org/3/search/multi?api_key=66aeb90ff00ebee2e50dd67451722ef8&language=it-IT&query="+ nome,
      method: "GET",
      success: function(datoRicevuto){
        
        $(".form-control").val("");
        var arrayRicevuto = datoRicevuto.results;
        var source = $("#template-serie-film").html();
        var template = Handlebars.compile(source);
        console.log(arrayRicevuto);

        if(arrayRicevuto.length>0){
          ricercaVal++;
          if(ricercaVal>=1){
            $(".bd-example").addClass("none");
          }
          // DAFARE
          // $(".lista .film .all").remove();
          // $(".listaserie .serie .all").remove();
          arrayRicevuto.forEach(element => {
            
            var votoFinale = conversioneVoto(element.vote_average);
            var context = {
              id: element.id,
              imgpassata: 'https://image.tmdb.org/t/p/w342/'+element.backdrop_path,
              // titolo: lunghezzaTitolo(element.title),
              // titoloCompleto: element.title,
              // titoloOriginale: element.original_title, 
              lingua: bandiera(element.original_language), 
              voto: votoFinale,
              stars: stelle(votoFinale),
              descrizione: element.overview
            };
            if(element.media_type=="movie"){
              context.titolo = lunghezzaTitolo(element.title);
              context.titoloCompleto = element.title;
              context.titoloOriginale= element.original_title;
              controllo(element.id,element.backdrop_path,context,element.media_type,template);
              // var html = template(context);
              // $(".lista .film").append(html);  
            } else {
              context.titolo = lunghezzaTitolo(element.name);
              context.titoloCompleto = element.name;
              context.titoloOriginale = element.original_name;
              controllo(element.id,element.backdrop_path,context,element.media_type,template);
              // $(".listaserie .serie").append(html);
            }
            // cercaCast(element.id);
            // cercaGeneri(element.id);
            // controlloImg(element.backdrop_path, context);
            // var html = template(context);
            // $(".lista .film").append(html);            
          });
        }
      }
    });  


    // //Chiamata per i film
    // $.ajax({
    //   url: "https://api.themoviedb.org/3/search/movie?api_key=66aeb90ff00ebee2e50dd67451722ef8&language=it-IT&query="+ nome,
    //   method: "GET",
    //   success: function(datoRicevuto){
    //     $(".form-control").val("");
    //     var arrayRicevuto = datoRicevuto.results;
    //     var source = $("#template-serie-film").html();
    //     var template = Handlebars.compile(source);

    //     if(arrayRicevuto.length>0){
    //       ricercaVal++;
    //       if(ricercaVal>=1){
    //         $(".bd-example").addClass("none");
    //       }
    //       $(".lista .film .all").remove();
    //       arrayRicevuto.forEach(element => {
    //         var votoFinale = conversioneVoto(element.vote_average);
    //         var context = {
    //           id: element.id,
    //           imgpassata: 'https://image.tmdb.org/t/p/w342/'+element.backdrop_path,
    //           titolo: lunghezzaTitolo(element.title),
    //           titoloCompleto: element.title,
    //           titoloOriginale: element.original_title, 
    //           lingua: bandiera(element.original_language), 
    //           voto: votoFinale,
    //           stars: stelle(votoFinale),
    //           descrizione: element.overview
    //         };
    //         cercaCast(element.id);
    //         cercaGeneri(element.id);
    //         controlloImg(element.backdrop_path, context);
    //         var html = template(context);
    //         $(".lista .film").append(html);            
    //       });
    //     }
    //   }
    // });  

    //Chiamata per le serie tv
    // $.ajax({
    //   url: "https://api.themoviedb.org/3/search/tv?api_key=66aeb90ff00ebee2e50dd67451722ef8&language=it-IT&query="+ nome,
    //   method: "GET",
    //   success: function(serie){
    //     $(".form-control").val("");
    //     var arraySerie = serie.results;
    //     var source = $("#template-serie-film").html();
    //     var template = Handlebars.compile(source);
    //     if(arraySerie.length>0){
    //       console.log((arraySerie));
    //       $(".listaserie .serie .all").remove();
    //       arraySerie.forEach(element => {
    //         var votoFinale = conversioneVoto(element.vote_average);
    //         var context = {
    //           id: element.id,
    //           imgpassata: 'https://image.tmdb.org/t/p/w342/'+element.backdrop_path,
    //           titolo: lunghezzaTitolo(element.name),
    //           titoloCompleto: element.name, 
    //           titoloOriginale: element.original_name, 
    //           lingua: bandiera(element.original_language), 
    //           voto: votoFinale,
    //           stars: stelle(votoFinale),
    //           descrizione: controlloDescrizione(element.overview)
    //         };
    //         cercaCast(element.id);
    //         cercaGeneri(element.id);
    //         controlloImg(element.backdrop_path, context);
    //         var html = template(context);
    //         $(".listaserie .serie").append(html);
    //       });
    //     }
    //   }
    // });
  }

  function controlloDescrizione(descrizione){
    if(descrizione.length==0){
      descrizione = "Descrizione non disponibile"
    }
    return descrizione;
  }

  function lunghezzaTitolo(titolo){
    var len = titolo.length;
    var titoloSostituto = titolo;
    if(len>=35){
      titoloSostituto = titolo.substr(0,30);
      titoloSostituto+=".....";
    }
    return titoloSostituto;
  }

  function controlloImg (val, context){
    if(val==null){
      context.imgnulla = "flexmy";
      context.altezza = "null"
    }
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
    } else if (linguaUpper=="HE"){
      linguaUpper = "IL";
    }
    return linguaUpper;
  }


  function stelle(voto){
    var init="";
    for(j=0; j<voto; j++){
      stella = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-star fa-w-18 fa-3x"><path fill="yellow" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" class=""></path></svg>';
      init+=stella;
    }
    var stella = '<svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-star fa-w-18 fa-3x"><path fill="yellow" d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM405.8 317.9l27.8 162L288 403.5 142.5 480l27.8-162L52.5 203.1l162.7-23.6L288 32l72.8 147.5 162.7 23.6-117.7 114.8z" class=""></path></svg>';  
    for(var i=0; i<5-voto; i++){
      init+=stella;
    }
    return init;
  }

  function classFlex (classe){
    $(classe).addClass("flex");
  } 

  function noNone (classe){
    $(classe).removeClass("none");
  }

  function siNone (classe){
    $(classe).addClass("none");
  }

});