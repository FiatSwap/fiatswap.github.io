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
		sellerUser: '',
		selectedBuyMode: '0',
		selectedBuyCr: '',
		tokenBuyValue: '',
		buyOffer: null
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
			address: 'TCFXnW4913MbvsAcYuA3LDvEjJWtTrTrqx',
			abi: [{"stateMutability":"Nonpayable","type":"Constructor"},{"outputs":[{"type":"address"}],"name":"ERC20Interface","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"inputs":[{"type":"address"},{"type":"uint256"}],"name":"lockedAmts","stateMutability":"View","type":"Function"},{"outputs":[{"name":"curr","type":"uint256"},{"name":"mode","type":"uint256"},{"name":"price","type":"uint256"},{"name":"locked","type":"uint256"},{"name":"display","type":"string"},{"name":"username","type":"string"}],"inputs":[{"type":"uint256"}],"name":"offers","stateMutability":"View","type":"Function"},{"outputs":[{"type":"address"}],"name":"owner","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"inputs":[{"type":"address"},{"type":"uint256"}],"name":"sellers","stateMutability":"View","type":"Function"},{"inputs":[{"name":"mode","type":"uint256"},{"name":"_price","type":"uint256"},{"name":"_display","type":"string"},{"name":"_username","type":"string"}],"name":"postOffer","stateMutability":"Payable","type":"Function"},{"inputs":[{"name":"amt","type":"uint256"},{"name":"mode","type":"uint256"},{"name":"_price","type":"uint256"},{"name":"_display","type":"string"},{"name":"_username","type":"string"}],"name":"postTokenOffer","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"index","type":"uint256"},{"name":"userIndex","type":"uint256"}],"name":"deleteOffer","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"buyer","type":"address"},{"name":"amount","type":"uint256"}],"name":"toBuyer","stateMutability":"Nonpayable","type":"Function"}]
		},
		usdt: {
			address: 'TXpKNWHzZj2LRcRFJKWjeyDa4tLdENmNgG',
			abi: [{"outputs":[{"type":"string"}],"constant":true,"name":"name","stateMutability":"View","type":"Function"},{"outputs":[{"type":"bool"}],"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"totalSupply","stateMutability":"View","type":"Function"},{"outputs":[{"type":"bool"}],"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"uint8"}],"constant":true,"name":"decimals","stateMutability":"View","type":"Function"},{"outputs":[{"type":"bool"}],"inputs":[{"name":"spender","type":"address"},{"name":"addedValue","type":"uint256"}],"name":"increaseAllowance","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"bool"}],"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"mint","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","stateMutability":"View","type":"Function"},{"outputs":[{"type":"string"}],"constant":true,"name":"symbol","stateMutability":"View","type":"Function"},{"inputs":[{"name":"account","type":"address"}],"name":"addMinter","stateMutability":"Nonpayable","type":"Function"},{"name":"renounceMinter","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"bool"}],"inputs":[{"name":"spender","type":"address"},{"name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"bool"}],"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"bool"}],"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"isMinter","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","stateMutability":"View","type":"Function"},{"stateMutability":"Nonpayable","type":"Constructor"},{"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"MinterAdded","type":"Event"},{"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"MinterRemoved","type":"Event"},{"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"Transfer","type":"Event"},{"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"Approval","type":"Event"}]
		}
	};
	$scope.placeHolders = {
		user: ['UPI ID (Example: ramesh@okaxis)', '10-Digit PayTM Phone Number', 'Paypal Email', 'Venmo Username'],
	};
	$scope.errors = {
		userBlank: ['UPI ID cannot be blank', 'Phone Number cannot be blank', 'Paypal Email cannot be blank', 'Venmo Username cannot be blank'],
		userInvalid: ['Please enter a valid UPI ID', 'Please enter a valid Phone Number', 'Please enter a valid Email', 'Please enter a valid Venmo Username']
	}
	$scope.modeLogos = ['bhim_big.png', 'paytm_big.png', 'paypal_big.png', 'venmo.svg'];
	$scope.modeNames = ['BHIM / PhonePe / PayTM UPI / Google Pay', 'PayTM', 'PayPal', 'Venmo'];
	$scope.modeUserLabels = ['UPI ID', 'Phone Number', 'Email', 'Username'];
	
	
	// on UI loaded
	$window.onload = function(e) {
		if ($window.tronWeb) {
			// console.log($window.tronWeb.address.toHex('TXpKNWHzZj2LRcRFJKWjeyDa4tLdENmNgG'));

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
		$scope.contracts.usdt.instance = await window.tronWeb.contract($scope.contracts.usdt.abi, $scope.contracts.usdt.address);

		// load posted offers
		$scope.myOffers = [];
		let fetchedAll = false;
		let fetchIndex = 0;
		while (!fetchedAll) {
			try {
				const resIndex = await $scope.contracts.swap.instance.sellers($scope.account.address.long, fetchIndex).call();
				const offerIndex = Number(resIndex) - 1;
				if (offerIndex == -1) {
					fetchIndex++;
					continue;
				}

				const resOffer = await $scope.contracts.swap.instance.offers(offerIndex).call();
				resOffer.quantity = resOffer.locked / (resOffer.curr == 0 ? 1000000 : 100);
				resOffer.logo = $scope.modeLogos[resOffer.mode];
				resOffer.fiat = (resOffer.mode <= 1 ? '₹' : '$') + resOffer.price;
				resOffer.myIndex = fetchIndex;
				resOffer.index = offerIndex;

				$scope.myOffers.push(resOffer);
				fetchIndex++;
			} catch(e) {
				// console.log(fetchIndex);
				// console.error(e);
				fetchedAll = true;
				$scope.$apply();
				
				$('.tooltipped').tooltip();
				console.log($scope.myOffers);
			}
		}
	}

	$scope.getOffer = async function() {
		if (!$scope.state.selectedBuyCr || $scope.state.selectedBuyCr == '') return toast('Please select a valid Token');
		
		if (!$scope.state.selectedBuyMode || $scope.state.selectedBuyMode == '') return toast('Please select a valid Payment Mode');

		if (isNaN($scope.state.tokenBuyValue) || $scope.state.tokenBuyValue < 1) return toast('Please enter a valid token amount (Min: 1)');

		// TODO: only allow non decimal values

		const amtToBuy = $scope.state.tokenBuyValue;// * ($scope.state.selectedBuyCr == 0 ? 1000000 : 100);

		let stopCmd = false;
		let offerIndex = 0;
		while (!stopCmd) {
			try {
				const resOffer = await $scope.contracts.swap.instance.offers(offerIndex).call();
				offerIndex++;

				if (resOffer.locked == 0) {
					continue;
				}

				resOffer.quantity = resOffer.locked / (resOffer.curr == 0 ? 1000000 : 100);

				if (resOffer.quantity >= amtToBuy && resOffer.curr == $scope.state.selectedBuyCr && resOffer.mode == $scope.state.selectedBuyMode) {
					$scope.state.buyOffer = {
						username: resOffer.username,
						price: resOffer.price,
						total: amtToBuy * resOffer.price,
						logo: $scope.modeLogos[resOffer.mode]
					};
					$scope.$apply();

					if (resOffer.mode == 0) {
						const upiUrl = `upi://pay?pa=${resOffer.username}&pn=X&am=${amtToBuy * resOffer.price}`;

						new QRCode(document.getElementById("qrcode"), {
							text: upiUrl,
							width: $('#payment-info').width() * 0.5,
							height: $('#payment-info').width() * 0.5
						});
					}

					break;
				}
			} catch (e) {
				console.error(e);
				stopCmd = true;
			}
		}
	}

	$scope.buyCancel = function() {
		$window.location.reload();
	}

	$scope.newOffer = async function() {
		if (!$scope.state.selectedCr || $scope.state.selectedCr == '') return toast('Please select a valid Token');
		
		if (!$scope.state.selectedMode || $scope.state.selectedMode == '') return toast('Please select a valid Payment Mode');

		if ($scope.state.sellerUser == '') return toast($scope.errors.userBlank[$scope.state.selectedMode]);

		let username = $scope.state.sellerUser;
		let usernameErrorFound;
		switch ($scope.state.selectedMode) {
			case '2': // paypal email
				// console.log(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(username));
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

		if ($scope.state.selectedCr == 'tron') {
			const res = await $scope.contracts.swap.instance.postOffer($scope.state.selectedMode, $scope.state.sellingPrice, $scope.state.sellerDisplay, $scope.state.sellerUser).send({
				callValue: 1000000 * $scope.state.tokenValue,
				shouldPollResponse: true
			});

				console.log(res);
				if (res == true) {
				toast('Tron Offer Created Successfully');
			} else {
				toast('Operation Failed');
			}
		} else {
			const amt = 100 * $scope.state.tokenValue;
			const allowance = await $scope.contracts.usdt.instance.allowance($scope.account.address.long, $scope.contracts.swap.address).call();

			let success = false;
			if (allowance >= amt) {
				success = true;
			} else {
				success = await $scope.contracts.usdt.instance.approve($scope.contracts.swap.address, amt - allowance).send({
					callValue: 0,
					shouldPollResponse: true
				});
			}

			if (success) {
				const res = await $scope.contracts.swap.instance.postTokenOffer(amt, $scope.state.selectedMode, $scope.state.sellingPrice, $scope.state.sellerDisplay, $scope.state.sellerUser).send({
					callValue: 0,
					shouldPollResponse: true
				});

				console.log(res);
				if (res == true) {
					toast('Token Offer Created Successfully');
				} else {
					toast('Operation Failed');
				}
			}
		}
	}

	$scope.deleteOffer = async function(index, myIndex) {
		console.log(`index = ${index}`);
		console.log(`myIndex = ${myIndex}`);

		try {
			const res = await $scope.contracts.swap.instance.deleteOffer(index, myIndex).send({
				shouldPollResponse: true
			});

			console.log(res);
			toast('Offer Deleted Successfully');
		} catch (e) {
			console.error(`Deletion Error - ${e}`);
			toast('Operation Failed');
		}

		// console.log(res);
		// 	if (res == true) {
		// 	toast('Offer Deleted Successfully');
		// } else {
		// 	toast('Operation Failed');
		// }
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
	$('.tabs').tabs({});
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