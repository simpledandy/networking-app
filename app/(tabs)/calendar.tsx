import { IconSymbol } from '@/components/ui/IconSymbol';
import { MagicalButton } from '@/components/ui/MagicalButton';
import { MagicGradients, MagicPalette } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const initialSessions = [
  { id: '1', date: '2024-06-01', title: 'Session with Alex' },
  { id: '2', date: '2024-06-03', title: 'Session with Jamie' },
  { id: '3', date: '2024-06-10', title: 'New Session' },
];

function getMonthDays(year: number, month: number) {
  const days = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  return days;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarScreen() {
  const [sessions, setSessions] = useState(initialSessions);
  const [selected, setSelected] = useState(new Date().toISOString().slice(0, 10));
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [anim] = useState(new Animated.Value(1));

  const days = getMonthDays(year, month);
  const todayStr = new Date().toISOString().slice(0, 10);

  const sessionsByDay: { [key: string]: any[] } = sessions.reduce((acc, s) => {
    (acc[s.date] = acc[s.date] || []).push(s);
    return acc;
  }, {});

  const addSession = () => {
    setSessions(prev => [
      ...prev,
      { id: Date.now().toString(), date: selected, title: 'New Session' },
    ]);
  };

  const changeMonth = (delta: number) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setMonth(newMonth);
    setYear(newYear);
    setSelected(`${newYear}-${String(newMonth + 1).padStart(2, '0')}-01`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.monthRow}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrowBtn}>
          <IconSymbol name="chevron.right" size={22} color="#007AFF" style={{ transform: [{ scaleX: -1 }] }} />
        </TouchableOpacity>
        <Animated.Text style={[styles.monthText, { opacity: anim }]}>{monthNames[month]} {year}</Animated.Text>
        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrowBtn}>
          <IconSymbol name="chevron.right" size={22} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.grid}>
        {days.map(day => {
          const dateStr = day.toISOString().slice(0, 10);
          const isSelected = selected === dateStr;
          const isToday = dateStr === todayStr;
          const hasSession = !!sessionsByDay[dateStr];
          const DayWrapper = isSelected || isToday ? LinearGradient : View;
          const gradientColors = isSelected
            ? MagicGradients.chip
            : isToday
            ? MagicGradients.main
            : [MagicPalette.background, MagicPalette.background];
          return (
            <DayWrapper
              key={dateStr}
              colors={gradientColors}
              style={[styles.day, isSelected && styles.selectedDay, isToday && styles.todayGlow]}
            >
              <TouchableOpacity
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
                onPress={() => setSelected(dateStr)}
                activeOpacity={0.8}
              >
                <Text style={[styles.dayText, (isSelected || isToday) && styles.selectedDayText]}>{day.getDate()}</Text>
                {hasSession && <View style={styles.dot} />}
              </TouchableOpacity>
            </DayWrapper>
          );
        })}
      </View>
      <MagicalButton
        title="Add Session"
        onPress={addSession}
        color={MagicPalette.purple}
        icon={<IconSymbol name="plus.circle.fill" size={20} color="#fff" />}
        style={{ marginVertical: 12 }}
      />
      <Text style={styles.sessionTitle}>Sessions on {selected}</Text>
      <FlatList
        data={sessionsByDay[selected] || []}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.sessionCard}>
            <Text style={styles.sessionText}>{item.title}</Text>
            <MagicalButton
              title="View"
              onPress={() => {}}
              color={MagicPalette.blue}
              icon={<IconSymbol name="eye" size={18} color="#fff" />}
              style={{ paddingVertical: 6, paddingHorizontal: 16, marginVertical: 0, marginLeft: 8 }}
            />
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#888', textAlign: 'center', marginTop: 16 }}>No sessions for this day.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: MagicPalette.background,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  arrowBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f4f8',
    marginHorizontal: 8,
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginHorizontal: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    backgroundColor: MagicPalette.background,
    borderRadius: 18,
    padding: 8,
    justifyContent: 'center',
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  day: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    backgroundColor: MagicPalette.card,
    position: 'relative',
    overflow: 'hidden',
  },
  selectedDay: {
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  todayGlow: {
    shadowColor: MagicPalette.blue,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  dayText: {
    fontSize: 16,
    color: MagicPalette.text,
  },
  selectedDayText: {
    color: MagicPalette.white,
    fontWeight: 'bold',
    textShadowColor: MagicPalette.purple,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: MagicPalette.purple,
    position: 'absolute',
    bottom: 6,
    left: '50%',
    marginLeft: -4,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 16,
  },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sessionText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 