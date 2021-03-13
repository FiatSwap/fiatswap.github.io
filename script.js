const config = {
	logTag: 'FIATSWAP - ',
	tronGridApi: 'https://api.shasta.trongrid.io'
};

let scope;
const app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $window, $interval) {
	$scope.state = {
		loading: true,
		selectedMode: '0',
		selectedCr: 'tron'
	};
	$scope.account = {
		address: null
	};
	$scope.prices = {
		tron: {
			inr: '-'
		}
	}
	
	
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
		}
	}

	$scope.newOffer = function() {
		alert('Post Offer');
	}

	scope = $scope;
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
	$('select').formSelect();

	loadPrices();
});

// load prices
function loadPrices() {
	$.get('https://api.coingecko.com/api/v3/simple/price?vs_currencies=inr,usd&ids=tether,tron', function(data, status) {
		if (status == 'success') {
			try {
				scope.prices = data;
				scope.$apply();
			} catch (e) {}
		}

		setTimeout(loadPrices, 60000);
	});
}