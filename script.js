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
		selectedCr: '',
		tokenValue: '',
		sellingPrice: '',
		sellerDisplay: '',
		sellerUser: ''
	};
	$scope.account = {
		address: null
	};
	$scope.prices = {
		tron: {
			inr: '-'
		}
	};
	$scope.contracts = {
		swap: {
			address: 'TBZkZbAQ8vrSrJtcuaH4LTjUSvkApM4y2x',
			abi: [{"stateMutability":"Nonpayable","type":"Constructor"},{"outputs":[{"type":"address"}],"name":"owner","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"inputs":[{"type":"address"},{"type":"uint256"}],"name":"sellers","stateMutability":"View","type":"Function"},{"inputs":[{"name":"mode","type":"uint256"},{"name":"_price","type":"uint256"},{"name":"_display","type":"string"},{"name":"_username","type":"string"}],"name":"postOffer","stateMutability":"Payable","type":"Function"},{"inputs":[{"name":"index","type":"uint256"}],"name":"deleteOffer","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"buyer","type":"address"},{"name":"amount","type":"uint256"}],"name":"toBuyer","stateMutability":"Nonpayable","type":"Function"}]
		}
	};
	$scope.placeHolders = {
		user: ['UPI ID (Example: ramesh@okaxis)', '10-Digit PayTM Phone Number', 'Paypal Email', 'Venmo Username'],
	};
	$scope.errors = {
		userBlank: ['UPI ID cannot be blank', 'Phone Number cannot be blank', 'Paypal Email cannot be blank', 'Venmo Username cannot be blank'],
		userInvalid: ['Please enter a valid UPI ID', 'Please enter a valid Phone Number', 'Please enter a valid Email', 'Please enter a valid Venmo Username']
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

					$scope.loadBcData();
					
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

	// load blockchain data
	$scope.loadBcData = async function() {
		$scope.contracts.swap.instance = await window.tronWeb.contract($scope.contracts.swap.abi, $scope.contracts.swap.address);
	}

	$scope.newOffer = async function() {
		if (!$scope.state.selectedCr || $scope.state.selectedCr == '') return toast('Please select a valid Token');
		
		if (!$scope.state.selectedMode || $scope.state.selectedMode == '') return toast('Please select a valid Payment Mode');

		if ($scope.state.sellerUser == '') return toast($scope.errors.userBlank[$scope.state.selectedMode]);

		let username = $scope.state.sellerUser;
		let usernameErrorFound;
		switch ($scope.state.selectedMode) {
			case '2': // paypal email
				console.log(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(username));
				usernameErrorFound = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(username.toLowerCase()) == false;
				break;
			
			case '1': // paytm phone
				usernameErrorFound = isNaN($scope.state.sellerUser) || $scope.state.sellerUser.length != 10;
				break;
			
			case '3': // venmo username
				usernameErrorFound = username.search(/^[a-zA-Z0-9-_]+$/) === -1;
				break;
			
			case '0': // upi
				usernameErrorFound = /^[a-zA-Z0-9\.\-]{2,256}\@[a-zA-Z][a-zA-Z]{2,64}/.test(username) == false;
				break;
		}
		if (usernameErrorFound) return toast($scope.errors.userInvalid[$scope.state.selectedMode]);

		if ($scope.state.sellerDisplay.trim() == '') return toast('Please enter the name on your account');
		
		if (isNaN($scope.state.tokenValue) || $scope.state.tokenValue < 1) return toast('Please enter a valid token amount (Min: 1)');
		
		if (isNaN($scope.state.sellingPrice) || $scope.state.sellingPrice < 0.0001) return toast('Please enter a valid selling price');

		const res = await $scope.contracts.swap.instance.postOffer($scope.state.selectedMode, $scope.state.sellingPrice, $scope.state.sellerDisplay, $scope.state.sellerUser).send({
			callValue: 1000000 * $scope.state.tokenValue
		});
	}

	scope = $scope;
});

// format address
function formatAddress(address) {
	const start = address.substr(0, 4);
	const end = address.substr(address.length - 4);
	return `${start}...${end}`;
}

// show toast
function toast(msg) {
	M.toast({ html: msg });
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