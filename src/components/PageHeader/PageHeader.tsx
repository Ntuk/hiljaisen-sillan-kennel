import './PageHeader.scss';
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  isAdminOpen?: boolean;
  leftButton?: ReactNode
  rightButton?: ReactNode;
}

function PageHeader({ title, isAdminOpen, leftButton, rightButton }: PageHeaderProps) {
  return (
    <div className={'header-container'}>
      <span className={'page-header'}>{title}</span>
      {leftButton && !isAdminOpen && leftButton}
      {rightButton && isAdminOpen && rightButton}
    </div>
  );
};

export default PageHeader;
