
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface EstrellaCalificacionProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
  color?: string;
}

const EstrellaCalificacion: React.FC<EstrellaCalificacionProps> = ({
  rating,
  onRatingChange,
  size = 40,
  color = '#FFB800',
}) => {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((starIndex) => (
        <TouchableOpacity
          key={starIndex}
          onPress={() => onRatingChange(starIndex)}
        >
          <Ionicons
            name={starIndex <= rating ? 'star' : 'star-outline'}
            size={size}
            color={color}
            style={styles.starIcon}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  starIcon: {
    marginHorizontal: 5,
  },
});

export default EstrellaCalificacion;