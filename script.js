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
			address: 'TUJxQcqh7PQA6q41SN92dzoBdBaauXDAWT',
			abi: [{"stateMutability":"Nonpayable","type":"Constructor"},{"outputs":[{"type":"address"}],"name":"ERC20Interface","stateMutability":"View","type":"Function"},{"outputs":[{"name":"locked","type":"uint256"},{"name":"display","type":"string"},{"name":"username","type":"string"}],"inputs":[{"type":"uint256"},{"type":"uint256"},{"type":"uint256"}],"name":"offers","stateMutability":"View","type":"Function"},{"outputs":[{"type":"address"}],"name":"owner","stateMutability":"View","type":"Function"},{"outputs":[{"name":"mode","type":"uint256"},{"name":"price","type":"uint256"},{"name":"index","type":"uint256"}],"inputs":[{"type":"address"},{"type":"uint256"}],"name":"sellers","stateMutability":"View","type":"Function"},{"inputs":[{"name":"_mode","type":"uint256"},{"name":"_price","type":"uint256"},{"name":"_display","type":"string"},{"name":"_username","type":"string"}],"name":"postOffer","stateMutability":"Payable","type":"Function"},{"inputs":[{"name":"amt","type":"uint256"},{"name":"_mode","type":"uint256"},{"name":"_price","type":"uint256"},{"name":"_display","type":"string"},{"name":"_username","type":"string"}],"name":"postTokenOffer","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"uint256"}],"name":"myOffersCount","stateMutability":"View","type":"Function"},{"outputs":[{"type":"string[]"}],"inputs":[{"name":"_mode","type":"uint256"},{"name":"_price","type":"uint256"},{"name":"amt","type":"uint256"}],"name":"getOfferUsers","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256[]"}],"inputs":[{"name":"_mode","type":"uint256"},{"name":"_price","type":"uint256"},{"name":"amt","type":"uint256"}],"name":"getOfferAmts","stateMutability":"View","type":"Function"},{"inputs":[{"name":"_mode","type":"uint256"},{"name":"_price","type":"uint256"},{"name":"globalIndex","type":"uint256"},{"name":"indexForUser","type":"uint256"}],"name":"deleteOffer","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"buyer","type":"address"},{"name":"amount","type":"uint256"}],"name":"toBuyer","stateMutability":"Nonpayable","type":"Function"}]
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
		try {
			const offersCount = await $scope.contracts.swap.instance.myOffersCount().call();
			
			for (let i = 0; i < offersCount; i++) {
				try {
					const resUserOfferData = await $scope.contracts.swap.instance.sellers($scope.account.address.long, i).call();
					const _globalIndex = resUserOfferData.index - 1;
					const _mode = resUserOfferData.mode;
					const _cr = _mode <= 3 ? _mode : _mode - 4;
					const _fiat = _mode == 0 || _mode == 1 || _mode == 4 || _mode == 5 ? 'inr' : 'usd';
					const _price = resUserOfferData.price;

					const resOffer = await $scope.contracts.swap.instance.offers(_mode, _price, _globalIndex).call();
					
					resOffer.quantity = resOffer.locked / (_mode <= 3 ? 1000000 : 100);
					resOffer.logo = $scope.modeLogos[_cr];
					resOffer.price = _price / 1000000;
					resOffer.fiat = (_fiat <= 'inr' ? '₹' : '$') + resOffer.price;
					resOffer.myIndex = i;
					resOffer.index = _globalIndex;
					resOffer.mode = _mode;
					resOffer.localIndex = i;
	
					$scope.myOffers.push(resOffer);
				} catch(e) {
					console.error(e);
				}	
			}
		} catch (e) {
			console.error(e);
			toast('Error loading offers');
		} finally {
			$scope.$apply();
			$('.tooltipped').tooltip();
		}

		// $scope.myOffers = [];
		// let fetchedAll = false;
		// let fetchIndex = 0;
		// while (!fetchedAll) {
		// 	try {
		// 		const resIndex = await $scope.contracts.swap.instance.sellers($scope.account.address.long, fetchIndex).call();
		// 		const offerIndex = Number(resIndex) - 1;
		// 		if (offerIndex == -1) {
		// 			fetchIndex++;
		// 			continue;
		// 		}

		// 		const resOffer = await $scope.contracts.swap.instance.offers(offerIndex).call();
		// 		resOffer.quantity = resOffer.locked / (resOffer.curr == 0 ? 1000000 : 100);
		// 		resOffer.logo = $scope.modeLogos[resOffer.mode];
		// 		resOffer.fiat = (resOffer.mode <= 1 ? '₹' : '$') + resOffer.price;
		// 		resOffer.myIndex = fetchIndex;
		// 		resOffer.index = offerIndex;

		// 		$scope.myOffers.push(resOffer);
		// 		fetchIndex++;
		// 	} catch(e) {
		// 		// console.log(fetchIndex);
		// 		// console.error(e);
		// 		fetchedAll = true;
		// 		$scope.$apply();
				
		// 		$('.tooltipped').tooltip();
		// 		console.log($scope.myOffers);
		// 	}
		// }
	}

	$scope.getOffer = async function() {
		if (!$scope.state.selectedBuyCr || $scope.state.selectedBuyCr == '') return toast('Please select a valid Token');
		
		if (!$scope.state.selectedBuyMode || $scope.state.selectedBuyMode == '') return toast('Please select a valid Payment Mode');

		if (isNaN($scope.state.tokenBuyValue) || $scope.state.tokenBuyValue < 10) return toast('Please enter a valid token amount (Min: 10)');

		// TODO: only allow non decimal values

		const amtToBuy = $scope.state.tokenBuyValue;// * ($scope.state.selectedBuyCr == 0 ? 1000000 : 100);

		$scope.buyRequest = {
			_mode: $scope.state.selectedBuyCr == 0 ? $scope.state.selectedBuyMode : $scope.state.selectedBuyMode + 4,
			amt: amtToBuy
		};

		//
		const marketPrice = $scope.prices[$scope.state.selectedBuyCr == 0 ? 'tron' : 'tether'][$scope.state.selectedBuyMode == 0 || $scope.state.selectedBuyMode == 1 ? 'inr' : 'usd'];
		console.log(`marketPrice = ${marketPrice}`);
		
		const scale = 0.05;
		
		let possiblePrices = [];
		let temp = getLowerMultiple(marketPrice, scale);
		possiblePrices.push(temp);
		for (let i = 0; i < 5; i++) {
			temp = prevMultiple(temp, scale);
			possiblePrices.push(temp);
		}
		temp = getHigherMultiple(marketPrice, scale);
		possiblePrices.push(temp);
		for (let i = 0; i < 5; i++) {
			temp = nextMultiple(temp, scale);
			possiblePrices.push(temp);
		}

		console.log(possiblePrices);
		possiblePrices.sort();
		possiblePrices = possiblePrices.map(function(e) {
			return Math.round(e * 1000000);
		});
		console.log(possiblePrices);

		$scope.possiblePrices = possiblePrices;
		$scope.buyResArrayIndex = -1;
		await $scope.getOffer2();
		
		// console.log(`getHigherMultiple = ${getHigherMultiple(marketPrice, scale)}`);
		// console.log(`getLowerMultiple = ${getLowerMultiple(marketPrice, scale)}`);
		return;
		//

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

	$scope.showOffer = function(request, price, username, innerIndex) {
		const op = price;
		const _price = price / 1000000;
		const _total = request.amt * _price;
		
		$scope.state.buyOffer = {
			amt: request.amt,
			ii: innerIndex,
			op,
			mode: request._mode,
			username,
			price: _price,
			total: _total,
			logo: $scope.modeLogos[request._mode <= 3 ? request._mode : request._mode - 4]
		};
		$scope.$apply();

		if (request._mode == 0) {
			const upiUrl = `upi://pay?pa=${username}&pn=X&am=${_total}`;

			new QRCode(document.getElementById("qrcode"), {
				text: upiUrl,
				width: $('#payment-info').width() * 0.5,
				height: $('#payment-info').width() * 0.5
			});
		}
	}

	$scope.bought = async function() {
		console.log(`fAuth.currentUser.uid = ${fAuth.currentUser.uid}`);

		const boughtByMe = await db.ref(`offers/${$scope.state.buyOffer.mode}-${$scope.state.buyOffer.op}-${$scope.state.buyOffer.ii}/${fAuth.currentUser.uid}`).get();
		let prev = boughtByMe.exists() && !isNaN(boughtByMe.val()) ? Number(boughtByMe.val()) : 0;
		console.log(`prev = ${prev}`);
		
		await db.ref(`offers/${$scope.state.buyOffer.mode}-${$scope.state.buyOffer.op}-${$scope.state.buyOffer.ii}/${fAuth.currentUser.uid}`).set(prev + Number($scope.state.buyOffer.amt))
		// await db.collection(`${$scope.state.buyOffer.mode}-${$scope.state.buyOffer.op}-${$scope.state.buyOffer.ii}`).add(upd)
		.then(function() {
			toast('Success');
			$window.location.reload();
		})
		.catch(function(e) {
			console.error(e);
		});
	}

	$scope.getOffer3 = async function(request, _price, innerIndex) {
		innerIndex++;
		console.log(`innerIndex = ${innerIndex}`);

		if (innerIndex >= $scope.offerUsernames.length) {
			$scope.getOffer2();
			return;
		} else if ($scope.offerUsernames[innerIndex] == '') {
			$scope.getOffer3(request, _price, innerIndex);
		}

		await db.ref().child('offers').child(`${request._mode}-${_price}-${innerIndex}`).get().then(function(snapshot) {
		// await db.collection(`${request._mode}-${_price}-${innerIndex}`).get().then(function(snapshot) {
			console.log('Fb ' + 1);
			
			let isValid = !snapshot.exists();
			console.log(`exists = ${snapshot.exists()}`);

			if (snapshot.exists()) {
				let taken = 0;
				const buyers = snapshot.val();

				for (let buyer in buyers) {					
					if (buyers.hasOwnProperty(buyer)) {
						taken += Number(buyers[buyer]) * 1000000;
						console.log(`taken part = ${taken}`);
					}
				}

				console.log(`ttl = ${$scope.offerAmts[innerIndex]}`);
				
				isValid = $scope.offerAmts[innerIndex] - taken >= request.amt * 1000000;
			}

			console.log(`isValid = ${isValid}`);

			if (isValid) $scope.showOffer(request, _price, $scope.offerUsernames[innerIndex], innerIndex);
			else $scope.getOffer3(request, _price, innerIndex);
		})
		.catch(function(e) {
			console.log('Fb ' + 1);
			console.error(e);
		});

		console.log('Fb ' + 2);
	}

	$scope.getOffer2 = async function () {
		$scope.buyResArrayIndex++;

		let arrayIndex = $scope.buyResArrayIndex;
		if (arrayIndex >= $scope.possiblePrices.length) {
			return;
		}

		console.log(`arrayIndex = ${$scope.buyResArrayIndex}`);

		const request = $scope.buyRequest;
		try {
			$scope.offerUsernames = await $scope.contracts.swap.instance.getOfferUsers(request._mode, $scope.possiblePrices[arrayIndex], request.amt).call();
			$scope.offerAmts = await $scope.contracts.swap.instance.getOfferAmts(request._mode, $scope.possiblePrices[arrayIndex], request.amt).call();
			console.log($scope.offerUsernames);
			console.log($scope.offerAmts);

			if ($scope.offerUsernames.length < 1 || $scope.offerAmts.length < 1) {
				$scope.getOffer2();
				// arrayIndex++;
				// if (arrayIndex < $scope.possiblePrices.length) $scope.getOffer2(arrayIndex++);	
			} else {
				// $scope.offerUsernames = resNames;
				// $scope.offerAmts = resAmts;
				$scope.getOffer3(request, $scope.possiblePrices[arrayIndex], -1);





				// await db.collection('offers').doc(`${request._mode}-${$scope.possiblePrices[arrayIndex]}-${arrayIndex}`).get().then(function(doc) {
				// 		console.log('Fb ' + 1);
				// 		console.log(doc.data());
						
				// 		if (doc.exists && doc.data() < request.amt) {
				// 			arrayIndex++;
				// 			if (arrayIndex < $scope.possiblePrices.length) $scope.getOffer2(arrayIndex++);	
				// 		}
				// 	})
				// 	.catch(function(e) {
				// 		console.log('Fb ' + 1);
				// 		console.error(e);
				// 	});

				// console.log('Fb ' + 2);
				
				// const _price = $scope.possiblePrices[arrayIndex] / 1000000;
				// const _total = request.amt * _price;
				
				// $scope.state.buyOffer = {
				// 	username: resOffer,
				// 	price: _price,
				// 	total: _total,
				// 	logo: $scope.modeLogos[request._mode <= 3 ? request._mode : request._mode - 4]
				// };
				// $scope.$apply();

				// if (request._mode == 0) {
				// 	const upiUrl = `upi://pay?pa=${resOffer}&pn=X&am=${_total}`;

				// 	new QRCode(document.getElementById("qrcode"), {
				// 		text: upiUrl,
				// 		width: $('#payment-info').width() * 0.5,
				// 		height: $('#payment-info').width() * 0.5
				// 	});
				// }
			}
		} catch (e) {
			console.error(e);

			arrayIndex++;
			if (arrayIndex < $scope.possiblePrices.length) $scope.getOffer2(arrayIndex++);
		}
		// return resOffer;
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
			const res = await $scope.contracts.swap.instance.postOffer($scope.state.selectedMode, Math.round($scope.state.sellingPrice * 1000000), $scope.state.sellerDisplay, $scope.state.sellerUser).send({
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
				const res = await $scope.contracts.swap.instance.postTokenOffer(amt, 4 + $scope.state.selectedMode, $scope.state.sellingPrice, $scope.state.sellerDisplay, $scope.state.sellerUser).send({
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

	$scope.deleteOffer = async function(localIndex) {
		// console.log(`index = ${index}`);
		// console.log(`myIndex = ${myIndex}`);

		try {
			const res = await $scope.contracts.swap.instance.deleteOffer($scope.myOffers[localIndex].mode, $scope.myOffers[localIndex].price, $scope.myOffers[localIndex].index, $scope.myOffers[localIndex].myIndex).send({
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

				console.log(scope.prices);
			} catch (e) {}
		}

		setTimeout(loadPrices, 60000);
	});
}

// multiple
function getHigherMultiple(x, scale) {
	x = scale * Math.ceil(x / scale);
	return arth(x);
}
function getLowerMultiple(x, scale) {
	x = scale * Math.floor(x / scale);
	return arth(x);
}
function nextMultiple(x, scale) {
	x += scale;
	return arth(x);
}
function prevMultiple(x, scale) {
	x -= scale;
	return arth(x);
}
// function countDecimals(x) {
// 	try {
// 		x = Number(x);
// 		return x.toString().split('.')[1].length;
// 	} catch (e) {
// 		return 0;
// 	}
// }
function arth(n) {
	return Math.round((n) * 1e12) / 1e12;
}