const config = {
	logTag: 'FIATSWAP - ',
	tronGridApi: 'https://api.shasta.trongrid.io'
};

const app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $window, $interval) {
	$scope.state = {
		loading: true
	};
	$scope.account = {
		address: null
	};
	
	
	// on UI loaded
	$window.onload = function(e) {
		if ($window.tronWeb) {
			let tries = 0, totalTries = 15;
			const interval = $interval(function() {
				if ($window.tronWeb.defaultAddress.base58 != false) {
					$scope.account.address = {
						long: $window.tronWeb.defaultAddress.base58,
						short: formatAddress($window.tronWeb.defaultAddress.base58)
					}

					
					$interval.cancel(interval);
					return;
				}

				tries++;
				if (tries > totalTries) $interval.cancel(interval);
			}, 1000);
		} else {
			alert('Install TronLink to continue');
			return;
		}

		$scope.newOffer = function() {
			alert('Post Offer');
		}
	}
});

// format address
function formatAddress(address) {
	const start = address.substr(0, 4);
	const end = address.substr(address.length - 4);
	return `${start}...${end}`;
}

$(document).ready(function() {
	$('.tabs').tabs({ swipeable: true });
	$('.modal').modal();
});