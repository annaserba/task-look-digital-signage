angular.module("app", ["templates"])
  .directive("app", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/app.tpl.html",
    };
  })
  .directive("contentView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/content-view.tpl.html",
      controller: ["$scope", contentView],
    };

    function contentView($scope) {
      $scope.filterSortApply = function(){
        $scope.model = $scope.data.slice();
        $scope.model = $scope.model
        .filter(m => m.title.toUpperCase().indexOf($scope.search.toUpperCase())!==-1)
        .sort((a, b) => {
          if(a[$scope.order] > b[$scope.order]){
            return 1;
          }
          if(a[$scope.order] < b[$scope.order]){
            return -1;
          }
          return 0;
        });

        $scope.$emit('filterSortApply', $scope.model);
      };

      $scope.onClickAdd = function($event){
        if($scope.add !== ""){
          $scope.data.push({"id": makeDataId(), "title": $scope.add, "tags":[], "date": Date.now() });
          $scope.model = $scope.data.slice();
          $scope.add = "";
          $scope.filterSortApply();
        }
      };

      $scope.onKeyAdd = function($event){
        if($event.keyCode == '13'){
          $scope.onClickAdd($event);
        }
      };

      $scope.onItemClick = function($event,id){
        $scope.selected = $scope.data.find(elem => elem.id === id);
        $scope.$emit('selectItem', $scope.selected, $scope.data);
      };

      $scope.selected = {};
      $scope.order = "title";
      $scope.onlyDate = false;
      $scope.add = "";
      $scope.search = "";
      $scope.data = makeDefaulData();
      $scope.filterSortApply();
    }
  })
  .directive("sidebarView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/sidebar-view.tpl.html",
      controller: ["$scope", "$rootScope", sidebarView],
    };
    function sidebarView($scope, $rootScope){
      $scope.addTag = "";
      const saveTags = function(){
        $scope.data.find(item => item.id === $scope.model.id).tags = $scope.model.tags;
        $scope.$emit('filterSortApply', $scope.data);
      };

      $scope.deleteTag = function($event, key){
        $scope.model.tags =  $scope.model.tags.filter((tag, index) => key !== index);
        saveTags();
      };

      $scope.onClickAdd = function($event){
        if(!$scope.model.tags.includes($scope.addTag) && $scope.addTag !== ""){
          $scope.model.tags.push($scope.addTag);
        }
        $scope.addTag = "";
        saveTags();
      };

      $scope.onKeyAdd = function($event){
        if($event.keyCode == '13'){
          $scope.onClickAdd($event);
        }
      };

      $rootScope.$on('selectItem', function(event,model, data) { 
         $scope.model = model;
         $scope.data = data;
       });
    }
  })
  .directive("elementsView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/elements-view.tpl.html",
      controller: ["$scope", "$element", elementsViewCtrl],
    };

    function elementsViewCtrl($scope, $element) {
      $scope.model = {
        width: 300,
      };

      $scope.setWidth = () => {
        let width = $scope.model.width;
        if (!width) {
          width = 1;
          $scope.model.width = width;
        }
        $element.css("width", `${width}px`);
      };
      $scope.setWidth();
    }
  })
  .directive("some1", () => {
    return {
      scope: {},
      restrict: "E",
      template: "<some-2></some-2>",
      controller: ["$scope", some1],
    };
    function some1($scope){
      $scope.model = $scope.$parent.model;
      $scope.data = $scope.$parent.data;
    }
  })
  .directive("some2", () => {
    return {
      scope: {},
      restrict: "E",
      template: "<some-3></some-3>",
      controller: ["$scope", some2],
    };

    function some2($scope){
      $scope.model = $scope.$parent.model;
      $scope.data = $scope.$parent.data;
    }
  })
  .directive("some3", () => {
    return {
      scope: {},
      restrict: "E",
      template: "<summary-view></summary-view>",
      controller: ["$scope", some3],
    };

    function some3($scope){
      $scope.model = $scope.$parent.model;
      $scope.data = $scope.$parent.data;
    }
  })
  .directive("summaryView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/summary-view.tpl.html",
      controller: ["$scope", "$rootScope", summaryView],
    };

    function summaryView($scope, $rootScope){
      const setModel = function(data){
        $scope.lastElem = data[data.length-1];
        $scope.tags = [];
        angular.forEach(data, (value) => {
          angular.forEach(value.tags, (tag) =>{
            if($scope.tags.indexOf(tag) === -1)
              $scope.tags.push(tag);
            });
        });
      };
      setModel($scope.$parent.model);
      $rootScope.$on('filterSortApply', function(event, data) { 
        setModel(data);
      });
    }
  });

