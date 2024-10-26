'use client';

import React from 'react';
import {
  DropdownRoot,
  DropdownItem,
  DropdownContent,
  DropdownTrigger,
} from '@/components/common';
import {
  BlogIcon,
  ChatIcon,
  TwitterIcon,
  DiscordIcon,
  DocumentIcon,
} from '@/components/icons';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';

import { PathConstant } from '@/const';

const ResourcesDropdown: React.FC<ResourcesDropdownProps> = ({ children }) => {
  const { t: getLabel } = useTranslation();

  return (
    <DropdownRoot>
      <DropdownTrigger>{children}</DropdownTrigger>
      <DropdownContent className="w-48" align="start">
        <ResourcesItem href={PathConstant.DOCUMENT_LINK}>
          <DocumentIcon /> {getLabel('lDocuments')}
        </ResourcesItem>

        <ResourcesItem href={PathConstant.TWITTER_URL}>
          <TwitterIcon /> {getLabel('lTwitter')}
        </ResourcesItem>

        <ResourcesItem href={PathConstant.DISCORD_LINK}>
          <DiscordIcon /> {getLabel('lDiscord')}
        </ResourcesItem>

        <ResourcesItem href={PathConstant.SUPPORT_LINK}>
          <ChatIcon />
          {getLabel('lSupport')}
        </ResourcesItem>

        <ResourcesItem href={PathConstant.BLOG_LINK}>
          <BlogIcon /> {getLabel('lBlog')}
        </ResourcesItem>
      </DropdownContent>
    </DropdownRoot>
  );
};

export default ResourcesDropdown;

interface ResourcesDropdownProps
  extends React.ComponentPropsWithoutRef<'div'> {}

const ResourcesItem: React.FC<ResourcesItemProps> = ({
  href,
  children,
  className,
  itemClassName,
  ...otherProps
}) => {
  return (
    <DropdownItem className={twMerge('w-full', itemClassName)}>
      <a
        href={href}
        target="_blank"
        className={twMerge('text-sm', 'flex items-center gap-x-1', className)}
        {...otherProps}
      >
        {children}
      </a>
    </DropdownItem>
  );
};

interface ResourcesItemProps extends React.ComponentPropsWithoutRef<'a'> {
  itemClassName?: string;
}
