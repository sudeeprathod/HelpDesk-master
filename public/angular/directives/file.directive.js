
ticketApp.directive('ngFiles', ['$parse', function ($parse) {

            function fn_link(scope, element, attrs) {

                var onChange = $parse(attrs.ngFiles);
                element.on('change', function (event) {
                	//alert('finaaly');
                    onChange(scope, { $files: event.target.files });
                });
            };

            return {
                link: fn_link
            }

             /*return {
		    link: function($scope, $element, $attrs, $ngModelCtrl){
		      function createFileInput(){
		        var fileInput = document.createElement("input");
		        fileInput.type = "file";
		        angular.element(fileInput).on("change",function(event){
		          $scope.$apply(function(){
		            $parse($attrs.onChange)($scope, {$event:event});
		          })
		          //remove old input
		          fileInput.remove();
		          //create new file input
		          createFileInput();
		        })
		        $element.append(fileInput);
		      }
		      createFileInput();
		    }
		  }*/
} ])