import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NotificationItem} from '../../models/notification_model';
import moment from 'moment';
import React from 'react';

interface NotificationCardProps extends NotificationItem {
  onClose: (id: string) => void;
}

const NotificationCard = ({
  id,
  title,
  timestamp,
  message,
  onClose,
}: NotificationCardProps) => {
  const {seconds, nanoseconds} = timestamp;

  const milliseconds = seconds * 1000 + nanoseconds / 1e6;
  const date = moment(milliseconds).toDate();

  // Format the date
  const formattedTimestamp = moment(date).format('hh:mm A | DD/MM');
  return (
    <View>
      <Text style={styles.timestamp}>{formattedTimestamp}</Text>

      <View style={[styles.card, styles.unreadCard]}>
        <Text style={styles.header}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => onClose(id)}>
          <Text style={styles.closeIcon}>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
    position: 'relative',
  },
  readCard: {},
  unreadCard: {
    backgroundColor: 'white',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  timestamp: {
    marginTop: 15,
    fontSize: 12,
    color: 'red',
  },
  message: {
    fontSize: 14,
    marginBottom: 10,
    color: 'black',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  closeIcon: {
    fontSize: 10,
    color: '#f00',
  },
});

export default NotificationCard;
