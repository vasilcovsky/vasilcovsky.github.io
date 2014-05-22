(function() {
  var app = angular.module('allmoldovagen', []);

  app.constant('authorAttitude', [
    'здорово', 'весело', 'бравурно', 'оптимистично', 'задорно', 'мажорно', 'потешно', 'празднично', 'разгульно', ' неплохо',
    'ужасно', 'бесконечно', 'плохо', 'безнадежно', 'беспредельно', 'отвратительно', 'дико', 'безумно'
  ])
  .factory('caseService', function() {
    return function (str, choice) {
      var strPub = {
          "а": ["ы", "е", "у", "ой", "е"],
          "(ш/ж/к/ч)а": ["%и", "%е", "%у", "%ой", "%е"],
          "б/в/м/г/д/л/ж/з/к/н/п/т/ф/ч/ц/щ/р/х": ["%а", "%у", "%а", "%ом", "%е"],
          "и": ["ей", "ям", "%", "ями", "ях"],
          "ый": ["ого", "ому", "%", "ым", "ом"],
          "й": ["я", "ю", "я", "ем", "е"],
          "о": ["а", "у", "%", "ом", "е"],
          "с/ш": ["%а", "%у", "%", "%ом", "%е"],
          "ы": ["ов", "ам", "%", "ами", "ах"],
          "ь": ["я", "ю", "я", "ем", "е"],
          "уль": ["ули", "уле", "улю", "улей", "уле"],
          "(ч/ш/д/т)ь": ["%и", "%и", "%ь", "%ью", "%и"],
          "я": ["и", "е", "ю", "ей", "е"]
        },
        cases = {
          r: 0,
          d: 1,
          v: 2,
          t: 3,
          p: 4
        },
        exs = {
          "ц": 2,
          "ок": 2
        },
        lastIndex, reformedStr, forLong, splitted, groupped, forPseudo, result;
      for (var i in strPub) {
        if (i.length > 1 && str.slice(-i.length) == i) {
          lastIndex = i;
          reformedStr = str.slice(0, -lastIndex.length);
          break;
        } else if (/[\(\)]+/g.test(i)) {
          i.replace(/\(([^\(\)]+)\)([^\(\)]+)?/g, function (a, b, c) {
            splitted = b.split("/");
            for (var o = 0; o < splitted.length; o++) {
              groupped = splitted[o] + c;
              strPub[groupped] = strPub[i];
              if (str.slice(-groupped.length) == groupped) {
                for (var x = 0, eachSplited = strPub[groupped]; x < eachSplited.length; x++) {
                  eachSplited[x] = eachSplited[x].replace("%", splitted[o]);
                }
                reformedStr = str.slice(0, -groupped.length);
                forPseudo = groupped;
              };
            };
          });
        } else {
          lastIndex = str.slice(-1);
          reformedStr = str.slice(0, -(forPseudo || lastIndex).length);
        }
        if (/\//.test(i) && !(/[\(\)]+/g.test(i)) && new RegExp(lastIndex).test(i)) forLong = i;
        for (var o in exs) {
          if (str.slice(-o.length) == o) reformedStr = str.slice(0, -exs[o]);
        }
      };

      try {
        result = reformedStr + strPub[(forPseudo || forLong || lastIndex)][cases[choice]].replace("%", lastIndex);
      }
      catch(err) {
        result = str;
      }
      return result;
    }
  })
  .controller('MainCtrl', ['$scope', '$window', 'authorAttitude', 'caseService', 
      function($scope, $window, authorAttitude, caseService) {
        $scope.authorAttitude = authorAttitude;

        var timeout_country = null;
        $scope.$watch('countries', function(value) {
          var value_ = value || '',
              countries = value_.split(',')
              ;

          $window.clearTimeout(timeout_country);
          timeout_country = $window.setTimeout(function() {
            $scope.acountries = _.chain(countries)
            .filter(function(c) {
              return jQuery.trim(c).length > 3;
            })
            .map(function(c) {
              return caseService(c, 'r');
            })
            .value();
            $scope.$digest();
          }, 500);

        });

        $scope.$watch('city', function(value) {
          var value_ = value || '';
          if (jQuery.trim(value_.length) > 3) {
            $scope.acity = caseService(value_, 'p');
          }
        });

        $scope.$watch('place', function(value) {
          var value_ = value || '';
          if (jQuery.trim(value_.length) > 3) {
            $scope.aplace = caseService(value_, 'r');
          }
        });

    }
  ]);
}());
