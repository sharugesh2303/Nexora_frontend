import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faDollarSign,
  faUserTie,
  faCopyright,
  faSyncAlt
} from '@fortawesome/free-solid-svg-icons';

// --- Styled Components (Tailored to the dark theme) ---
const PolicyContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: #0d0d0d;
  color: #e0e0e0;
  padding: 80px 50px;
  box-sizing: border-box;
`;

const ContentWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  text-align: left;
`;

const Header = styled.div`
  border-bottom: 2px solid #00e0b3;
  padding-bottom: 20px;
  margin-bottom: 40px;
  position: relative;
`;

const Title = styled.h1`
  font-size: 3em;
  color: white;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #aaaaaa;
  font-size: 1.1em;
  margin-top: 10px;
`;

const BackButton = styled.button`
  position: absolute;
  top: -40px; /* Position above the header */
  left: 0;
  background: none;
  border: none;
  color: #00e0b3;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  padding: 5px 10px;
  transition: color 0.3s ease;

  &:hover {
    color: white;
  }
`;

const PolicyBlock = styled.div`
  background-color: #000000;
  border: 1px solid #1a1a1a;
  padding: 25px;
  margin-bottom: 20px;
  border-radius: 8px;
`;

const BlockHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  h3 {
    color: white;
    font-size: 1.2em;
    margin: 0 0 0 15px;
  }
`;

const IconWrapper = styled.div`
  color: #00e0b3;
  font-size: 1.5em;
`;

const BlockContent = styled.div`
  ul {
    list-style: none;
    padding-left: 0;
    margin-top: 15px;
  }
  li {
    color: #cccccc;
    font-size: 0.95em;
    line-height: 1.6;
    margin-bottom: 5px;
  }
`;

const HelpBox = styled.div`
  background-color: #0a0a0a;
  border: 1px solid #00e0b3;
  padding: 30px;
  margin-top: 30px;
  border-radius: 5px;
  text-align: center;

  h4 {
    color: white;
    font-size: 1.1em;
    margin-bottom: 15px;
  }
  p {
    color: #00e0b3;
    font-size: 0.95em;
    margin: 5px 0;
  }
  span {
    color: #cccccc;
  }
`;

// --- Terms Data ---
const termsData = [
  {
    title: 'Payment Terms',
    icon: faDollarSign,
    points: [
      '50% advance payment required before project initiation',
      'Remaining 50% due upon project completion and delivery',
      'All payments must be made through approved payment methods',
      'Refunds available only within 7 days with valid reason'
    ]
  },
  {
    title: 'Client Responsibilities',
    icon: faUserTie,
    points: [
      'Provide accurate and complete project requirements',
      'Share all necessary information, assets, and access credentials',
      'Respond to queries and feedback requests within 48 hours',
      'Review deliverables and provide feedback promptly'
    ]
  },
  {
    title: 'Ownership & Rights',
    icon: faCopyright,
    points: [
      'Full ownership rights transfer to client upon full payment',
      'NEXORA retains right to showcase work in portfolio',
      'Client must not resell or redistribute deliverables as their own service',
      'Any third-party assets used will be properly licensed'
    ]
  },
  {
    title: 'Project Modifications',
    icon: faSyncAlt,
    points: [
      'Up to 2 rounds of revisions included in project cost',
      'Additional revisions may incur extra charges',
      'Major scope changes require new agreement and pricing',
      'Timeline extensions due to client delays may affect final delivery'
    ]
  }
];

const TermsAndConditions = () => {
  const navigate = useNavigate();

  const contactInfo = {
    email: 'nexora.crew@gmail.com',
    phone: '+91 95976 46460'
  };

  return (
    <PolicyContainer>
      <ContentWrapper>
        <Header>
          {/* BACK OPTION */}
          <BackButton onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '10px' }} />
            Back
          </BackButton>

          <Title>Terms & Conditions</Title>
          <Subtitle>Please read these terms carefully before using our services</Subtitle>
        </Header>

        {termsData.map((block, index) => (
          <PolicyBlock key={index}>
            <BlockHeader>
              <IconWrapper>
                <FontAwesomeIcon icon={block.icon} />
              </IconWrapper>
              <h3>{block.title}</h3>
            </BlockHeader>
            <BlockContent>
              <ul>
                {block.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </BlockContent>
          </PolicyBlock>
        ))}

        <HelpBox>
          <h4>Need Help?</h4>
          <p>For any questions regarding these terms, please contact us:</p>
          <p>
            Email: <span>{contactInfo.email}</span>
          </p>
          <p>
            Phone: <span>{contactInfo.phone}</span>
          </p>
        </HelpBox>
      </ContentWrapper>
    </PolicyContainer>
  );
};

export default TermsAndConditions;
