import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import {
  OtrixContainer,
  OtrixHeader,
  OtrixContent,
  OtrixDivider,
  OtrixLoader,
  OtirxBackButton,
  CategoryView,
} from '@component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { CategorySkeleton } from '@skeleton';
import { _roundDimensions } from '@helpers/util';
import getApi from '@apis/getApi';

function CategoryScreen(props) {
  const [state, setState] = React.useState({ data: [], loading: true });

  useEffect(() => {
    try {
      const unsubscribe = getApi.getData('getCategories', []).then(response => {
        if (response.status == 1) {
          setState({
            ...state,
            data: response.data,
            loading: false,
          });
        }
      });
      return unsubscribe; //unsubscribe
    } catch (error) {}
  }, []);

  const { data, loading } = state;
  return (
    <OtrixContainer customStyles={{ backgroundColor: Colors.light_white }}>
      {/* Header */}
      <OtrixHeader customStyles={{ backgroundColor: Colors.light_white }}>
        {/* <TouchableOpacity style={GlobalStyles.headerLeft} onPress={() => props.navigation.goBack()}>
                    <OtirxBackButton />
                </TouchableOpacity> */}
        <View style={[GlobalStyles.headerCenter, { flex: 0.9 }]}>
          <Text style={GlobalStyles.headingTxt}>Categories</Text>
        </View>
      </OtrixHeader>

      {/* Content Start from here */}
      {loading ? (
        <CategorySkeleton />
      ) : (
        <OtrixContent>
          {/* Category Component Start from here */}
          <CategoryView navigation={props.navigation} categoriesData={data} />
        </OtrixContent>
      )}
    </OtrixContainer>
  );
}

function mapStateToProps({ params }) {
  return {};
}

export default connect(mapStateToProps)(CategoryScreen);
