import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  LayoutAnimation, 
  Platform, 
  UIManager,
  TextInput,
  Animated
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ------------------------------------------------------------------
// STRICTLY VERBATIM HANDBOOK DATA 
// ------------------------------------------------------------------
const HANDBOOK_DATA = [
  {
    id: '0',
    chapter: 'Preface',
    title: 'Preface',
    content: 'For any navigation to be successful, a radar or global positioning system (GPS) is needed, to guide a traveller or navigator in his/her own way. This student handbook is one guide for incoming student travellers in MSU-Main Campus, Marawi City. To be able to come up with wide-ranging and updated information about student matters, the committee that is tasked to review, revise and publish this Student Handbook takes into consideration the latest developments on campus, that are in line with the vision of the present university administration under the leadership of MSU System President, Dr. Habib W. Macaayong, for a world class MSU by 2020.\n\nFor your easy reference, this handbook has been divided into major sections as follows:\n1. Student Planner\n2. Chapter I The University\n3. Chapter II Frontline Offices for Student Services\n4. Chapter III Code of Discipline and Laws\n5. Chapter IV Colleges and Courses Offered\n6. Appendix\n\nIt is hoped that this handbook will be useful and helpful for you as MSU students to become well informed and properly guided during your stay or journey in the University.'
  },
  {
    id: '1',
    chapter: 'Chapter I: The University',
    title: 'Message',
    content: 'Through the years the Mindanao State University has survived, thrived and flourish amidst the enormous challenges of her time. She has been steadfastly strong and resilient even in the face of her darkest history- the terror inspired by the Marawi Siege. Instead of sulking in the shadow of this horrifying reality, she rather rose to the occasion, inspired hope to the people and helped rekindle vitality in the region. MSU breathes and lives for the realization of her unbounded mandate as a national formulation for peace and development in the MINSUPALA. Her stout resolution lies in the vision and missions inscribed in her creation as an inimitable institution.'
  },
  {
    id: '2',
    chapter: 'Chapter II: Frontline Offices for Student Services',
    title: 'Division of Student Affairs',
    content: 'Functions and Services of the Division of Student Affairs of MSU-Main Campus (Per BOR Res. No. 496, Series of 1970)\n1. Provides an effective channel of communication between the student body, on the one hand, and the administration, faculty and staff on the other;\n2. Receives from the students and student organizations’ suggestions and recommendations for the improvement of the University as well as complaints and grievances of students;\n3. Endeavors to explain the policies of the university;\n4. Endeavors to resolve student problems, provided that those that cannot be solved or lie beyond its competence shall be transmitted to higher authorities of the University for information, guidance or appropriate action;'
  },
  {
    id: '3',
    chapter: 'Chapter II: Frontline Offices for Student Services',
    title: 'Housing Management Division',
    content: 'The Housing Management Division supervises student dormitories and residence halls for faculty, staff and other MSU employees in accordance with approved rules and regulations. It also administers the established housing policies to the university-owned housing units. The five (5) girls’ dormitories can accommodate a total of 1,600 residents while the three (3) men’s dormitories can accommodate a total of 800 residents.\n\nAccommodation at the dormitories is free to all scholars and grants in-aid recipients. For paying students, the semestral fee per resident is P350 (subject to change anytime to cope with inflation), to be paid at the University Business Office (UBO).'
  },
  {
    id: '4',
    chapter: 'Chapter II: Frontline Offices for Student Services',
    title: 'Norms of Conduct for Dormitory Residents',
    content: 'It is the responsibility of each resident in both his/her personal conduct and his/her attitude toward others to contribute to an atmosphere conducive to study. Radios, record players, CD players, tape recorders and other musical instruments must be operated with due consideration of the comfort of other residents and in observance of quiet hours. Silence should be observed on the following study hours in the evening: 8:00 to 12:00. Lights in the room must be switched off after 12:00 midnight except during review and examination days.\n\nViolence against person or property is an offense, hence, subject to disciplinary action. Drinking liquor or any alcoholic drink is strictly prohibited inside the residence halls or in the University premises; creating disturbances while under the influence of alcohol is an unbecoming conduct which is ground for disciplinary action and eventual dismissal from the dormitory.'
  },
  {
    id: '5',
    chapter: 'Chapter III: Code of Discipline and Laws',
    title: 'Art. 476. Grounds for Discipline',
    content: 'No student shall be suspended, expelled or dismissed except for cause and after due process as provided by this Code. The following shall be grounds for disciplinary action:\n\n1. Cheating in any form in any examination or any act of dishonesty in relation to his/her studies;\n2. Carrying within the University premises any firearms, bladed, dangerous or deadly weapon, provided that this shall not apply to one who has permit from the Dean or Director of his College to possess any of the above-mentioned weapons in connection with his/her studies in addition to a permit from competent authorities where the carrying of such weapon is so required;\n3. Bringing, selling, keeping or drinking any alcoholic beverage within the campus of the University;'
  },
  {
    id: '6',
    chapter: 'Chapter III: Code of Discipline and Laws',
    title: 'Art. 492. Sanctions',
    content: 'Art. 492. Sanctions. The penalty of expulsion or dismissal shall carry with it the accessory penalty of withholding graduation or permanent disqualification of the respondent to continue studying in any unit of the University. The penalty of suspension shall carry with the accessory penalty of forfeiture of the privilege to enjoy scholarships benefits, and dormitory and library facilities, during the period of suspension.\n\nThe gravity of the offense committed and the circumstances attending its commission shall determine the nature of disciplinary action taken against the student and shall be reported to his parents or guardians.'
  },
  {
    id: '7',
    chapter: 'Chapter III: Code of Discipline and Laws',
    title: 'Campus Journalism Act of 1991',
    content: 'SECTION 2. Declaration of Policy- It is the declared policy of the State to uphold and protect the freedom of the press even at the campus level and promote the development and growth of campus journalism as a means of strengthening ethical values, encouraging critical and creative thinking, and developing moral character and personal discipline of the Filipino youth.\n\nIn furtherance of this policy, the State shall undertake various programs and projects aimed at improving the journalistic skills of students concerned and promoting responsible and free journalism.'
  }
];

// ------------------------------------------------------------------
// ACCORDION COMPONENT
// ------------------------------------------------------------------
const AccordionItem = ({ chapter, title, content }: { chapter: string, title: string, content: string }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity style={styles.accordionHeader} onPress={toggleExpand} activeOpacity={0.7}>
        <View style={styles.titleWrapper}>
          <Text style={styles.chapterText}>{chapter}</Text>
          <Text style={styles.accordionTitle}>{title}</Text>
        </View>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={22} color="#D4AF37" />
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.accordionContent}>
          <Text style={styles.contentText}>{content}</Text>
        </View>
      )}
    </View>
  );
};

// ------------------------------------------------------------------
// MAIN SCREEN COMPONENT
// ------------------------------------------------------------------
export default function HandbookScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Track the scroll position
  const scrollY = useRef(new Animated.Value(0)).current;

  // Filter the data based on search input
  const filteredData = HANDBOOK_DATA.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.chapter.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query)
    );
  });

  // Calculate the upward slide. The top header content is 90px tall.
  // We clamp the interpolation so it stops moving up exactly when the search bar hits the top.
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 90],
    outputRange: [0, -90],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      
      {/* 1. Static Status Bar Block (Keeps the background red so text doesn't peek behind the notch) */}
      <View style={styles.statusBarBackground} />

      {/* 2. Animated Header (Slides up dynamically based on scroll position) */}
      <Animated.View style={[styles.headerContainer, { transform: [{ translateY: headerTranslateY }] }]}>
        
        {/* Top Header Section - This part slides up and hides */}
        <View style={styles.topHeaderContent}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation?.goBack()}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="arrow-back" size={26} color="#D4AF37" />
          </TouchableOpacity>

          <Ionicons name="book" size={28} color="#D4AF37" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Student Handbook</Text>
          <Text style={styles.headerSubtitle}>Official MSU Guidelines & Policies</Text>
        </View>

        {/* Search Section - This part becomes the sticky header */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#888" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search policies, offices, chapters..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#ccc" />
              </TouchableOpacity>
            )}
          </View>
        </View>

      </Animated.View>

      {/* 3. The Animated Scroll Content */}
      <Animated.ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true } // Utilizes native UI thread for buttery smooth 60fps animations
        )}
        scrollEventThrottle={16}
      >
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <AccordionItem 
              key={item.id} 
              chapter={item.chapter} 
              title={item.title} 
              content={item.content} 
            />
          ))
        ) : (
          <Text style={styles.noResultsText}>No results found for {searchQuery}</Text>
        )}
        
        <View style={{ height: 120 }} /> 
      </Animated.ScrollView>
    </View>
  );
}

// ------------------------------------------------------------------
// STYLES
// ------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  statusBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60, // Matches your original top padding
    backgroundColor: '#4A0E0E',
    zIndex: 20, // Forces this block to sit above the sliding header
  },
  headerContainer: {
    position: 'absolute',
    top: 60, // Starts immediately below the status bar background
    left: 0,
    right: 0,
    backgroundColor: '#4A0E0E',
    borderBottomWidth: 3,
    borderBottomColor: '#D4AF37',
    zIndex: 10, // Sits above the scroll items but below the status bar background
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  topHeaderContent: {
    height: 90, // Strict height makes math for translation seamless
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 5,
    left: 20,
    zIndex: 10,
  },
  headerIcon: {
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#f0e6d2',
    marginTop: 2,
  },
  searchWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '100%',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: '#333333',
    padding: 0,
  },
  scrollContent: {
    paddingTop: 240, // Buffers content downward to accommodate absolute positioned header
    paddingHorizontal: 16,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
  },
  accordionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#ffffff',
  },
  titleWrapper: {
    flex: 1,
    paddingRight: 10,
  },
  chapterText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#a02f10',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  accordionContent: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 4,
    backgroundColor: '#ffffff',
  },
  contentText: {
    fontSize: 15,
    color: '#555555',
    lineHeight: 24,
  },
});