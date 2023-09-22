import { theme as chakraTheme, ThemeComponents } from '@chakra-ui/theme';

const { Alert, Avatar, Badge, Button, Card, Container, Heading, Link, Menu, Spinner, Table } =
  chakraTheme.components;

export const components: ThemeComponents = {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Container,
  Heading,
  Link: {
    ...Link,
    baseStyle: {
      ...Link.baseStyle,
      display: 'flex',
      alignItems: 'center',
    },
  },
  Menu,
  Spinner,
  Table,
};
