import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import {
  OtrixContainer,
  OtrixHeader,
  OtrixDivider,
  OtirxBackButton,
  OtrixContent,
  OtrixLoader,
} from '@component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { logfunction } from '@helpers/FunctionHelper';
import { _roundDimensions } from '@helpers/util';
import Fonts from '@helpers/Fonts';
import getApi from '@apis/getApi';
import { InventoryLogComponent } from '../component';
function History(props) {
  const [state, setState] = React.useState({
    historyList: [],
    currentPage: 1,
    totalPages: 1,
    loading: true,
    loader: false,
  });
  const { historyList, totalPages, currentPage, loading, loader } = state;

  const fetchData = page => {
    getApi.getData('seller/getHistory?page=' + page, []).then(response => {
      if (response.status == 1) {
        setState(prevstate => ({
          ...prevstate,
          historyList:
            page == 1
              ? response.data.data
              : [...prevstate.historyList, ...response.data.data],
          totalPages: response.data.last_page,
          loading: false,
          loader: false,
        }));
      }
    });
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      fetchData(1);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return () => unsubscribe();
  }, []);

  const paginate = () => {
    if (totalPages > 1 && currentPage <= totalPages) {
      setState({
        ...state,
        loader: true,
        currentPage: currentPage + 1,
      });
      fetchData(currentPage + 1);
    }
  };

  const renderFooter = () => {
    return (
      //Footer View
      <View>
        {loader && <OtrixLoader />}
        <OtrixDivider size={'sm'} />
      </View>
    );
  };

  const renderItem = ({ item, index }) => (
    <InventoryLogComponent navigation={props.navigation} history={item} sellerId={props.customerData?.id} />
  );

  return (
    <OtrixContainer customStyles={{ backgroundColor: '#292B2E' }}>
      {/* Header */}
      <OtrixHeader customStyles={{ backgroundColor: '#292B2E' }}>
        {/*<TouchableOpacity
          style={GlobalStyles.headerLeft}
          onPress={() => props.navigation.navigate('ProfileScreen')}>
          <OtirxBackButton />
        </TouchableOpacity>*/}
        <View>
          <Text style={{color : 'white', fontSize: 25}}> Inventory Log</Text>
        </View>
      </OtrixHeader>

      {/* Orders Content start from here */}
      <OtrixDivider size={'sm'} />
      {loading ? (
        <OtrixLoader />
      ) : (
        <View
          style={styles.addressBox}
          showsHorizontalScrollIndicator={false}
          vertical={false}>
          {historyList.length > 0 ? (
            <FlatList
              style={{ padding: wp('1%') }}
              data={historyList}
              horizontal={false}
              onEndReachedThreshold={0.2}
              showsVerticalScrollIndicator={false}
              keyExtractor={(contact, index) => String(index)}
              ListFooterComponent={renderFooter}
              onEndReached={({ distanceFromEnd }) => {
                paginate();
              }}
              renderItem={renderItem}
            />
          ) : null}
        </View>
      )}
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {
    cartData: state.cart.cartData,
    customerData: state.auth.USER_DATA,
  };
}

export default connect(mapStateToProps)(History);

const styles = StyleSheet.create({
  deliveryTitle: {
    fontFamily: Fonts.Font_Semibold,
    fontSize: wp('3.8%'),
    color: Colors.text_color,
    marginLeft: wp('5%'),
  },
  addressBox: {
    marginHorizontal: wp('4%'),
    flex: 1,
    height: 'auto',
    borderRadius: wp('2%'),
  },
  deliveryBox: {
    marginHorizontal: wp('1.5%'),
    width: wp('88%'),
    marginVertical: hp('0.5%'),
    height: hp('30.5%'),
    borderRadius: wp('2%'),
    backgroundColor: Colors.white,
    padding: wp('2.5%'),
  },
  addressTxt: {
    fontSize: wp('3.6%'),
    fontFamily: Fonts.Font_Reguler,
    color: Colors.text_color,
    textAlign: 'left',
  },
  deliveryAddressTxt: {
    textAlign: 'right',
    fontSize: wp('3.4%'),
    fontFamily: Fonts.Font_Reguler,
    color: Colors.link_color,
  },
  edit: {
    textAlign: 'right',
  },
  editView: { justifyContent: 'flex-start' },
  addressContent: {
    flexDirection: 'row',
  },
});
